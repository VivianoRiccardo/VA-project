import React from "react";

const InputAxis = ({ state, handleSelectChange }) => {
  const options = [
    { label: "X", value: "select1Value", select: "xselect1" },
    { label: "Y", value: "select2Value", select: "yselect1" },
    { label: "Radius", value: "select3Value", select: "radiusselect1" },
  ];

  return (
    <center className="circle-container">
      {options.map(({ label, value, select }, index) => (
        <div key={index}>
          <label>{label}</label>
          <select
            value={state[value]}
            onChange={(e) => {
              debugger;
              handleSelectChange(value, e.target?.value);
            }}
            disabled={index !== 0 && state?.select1Value === ""}
          >
            {state[select].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </center>
  );
};

export default InputAxis;
