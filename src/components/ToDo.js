import React, { useState, useEffect } from 'react';
import CustomDateTimePicker from './CustomDateTimePicker.js';
import { FaSun, FaMoon, FaTimes, FaMinus } from 'react-icons/fa';

function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    window.electronAPI.loadTasks();
    window.electronAPI.onTasksLoaded((loadedTasks) => {
      setTasks(loadedTasks.map(task => ({
        ...task,
        deadline: new Date(task.deadline)
      })));
    });
  }, []);

  useEffect(() => {
    window.electronAPI.saveTasks(tasks);

    const interval = setInterval(() => {
      const now = new Date();
      setTasks(prevTasks =>
        prevTasks.map((t, index) => {
          if (!t.completed && now >= new Date(t.deadline) && !t.reminded) {
            window.electronAPI.sendTaskReminder(index);
            return { ...t, reminded: true };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false, deadline, reminded: false }]);
      setTask('');
      setDeadline(new Date());
    }
  };

  const toggleComplete = (index) => {
    setTasks(prevTasks =>
      prevTasks.map((t, i) => {
        if (i === index) {
          const newTask = { ...t, completed: !t.completed };
          if (newTask.completed) {
            window.electronAPI.sendTaskCompleted(index);
          }
          return newTask;
        }
        return t;
      })
    );
  };

  const deleteTask = (index) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  };

  const updateTaskDeadline = (index, date) => {
    setTasks(prevTasks =>
      prevTasks.map((t, i) => i === index ? { ...t, deadline: date, reminded: false } : t)
    );
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-theme');
  };

  const closeApp = () => {
    window.electronAPI.closeApp();
  };

  const minimizeApp = () => {
    window.electronAPI.minimizeApp();
  };

  return (
    <div className={`todo-container ${isDarkMode ? '' : 'light-theme'}`}>
      <div className="title-bar">
        <h1>To-Do List</h1>
        <button className="minimize-button" onClick={minimizeApp}>
          <FaMinus />
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="close-button" onClick={closeApp}>
          <FaTimes />
        </button>
      </div>
      <div className="task-input-container">
        <textarea
          className="task-input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task"
          rows={2}
        />
        <div className="input-separator">|</div>
        <div className="datetime-picker-wrapper">
          <CustomDateTimePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
          />
        </div>
      </div>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((t, index) => (
          <li key={index} className={t.completed ? 'completed' : ''}>
            <div className="task-content">
              <span className="task-text">{t.text}</span>
            </div>
            <div className="task-actions-container">
              <CustomDateTimePicker
                selected={new Date(t.deadline)}
                onChange={(date) => updateTaskDeadline(index, date)}
              />
              <div className="task-buttons">
                <button onClick={() => toggleComplete(index)}>
                  {t.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDo;