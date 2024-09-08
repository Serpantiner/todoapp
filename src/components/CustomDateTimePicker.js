import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <button className="custom-datepicker-input" onClick={onClick} ref={ref}>
    {value}
  </button>
));

function CustomDateTimePicker({ selected, onChange }) {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm aa"
      minDate={new Date()}
      customInput={<CustomInput />}
      popperPlacement="bottom-start"
      popperModifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
    />
  );
}

export default CustomDateTimePicker;