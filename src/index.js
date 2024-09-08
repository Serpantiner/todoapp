import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';  // Ensure .js extension is included
import reportWebVitals from './reportWebVitals.js';  // Ensure .js extension is included

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
