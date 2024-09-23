import React from "react";

const Circles = ({ state, handleInputChange }) => {
  const textStyle = {
    color: "rgba(255,255,255,0.5)",
    font: "Arial",
    fontSize: "80%",
  };

  return (
    <center className="circle-container">
      {state.circles_radius.map((radius, index) => (
        <div key={index} className="subcircles">
          <div
            className="circle"
            style={{
              width: `${state.multiplier_circle * radius}px`,
              height: `${state.multiplier_circle * radius}px`,
              marginTop: `${
                (state.multiplier_circle *
                  state.circles_radius[state.circles_radius.length - 1] -
                  state.multiplier_circle * radius) /
                2
              }px`,
            }}
          ></div>
          <div style={textStyle}>
            {"<= "}
            {index < state.circles_radius.length - 1 ? (
              <input
                id={index.toString()}
                style={{ width: "15%" }}
                onChange={handleInputChange}
                placeholder={state.sizes[index]}
              />
            ) : (
              `> ${state.sizes[state.sizes.length - 1]}`
            )}
          </div>
          <div style={textStyle}>{state.axis_names[state.radius]}</div>
        </div>
      ))}
    </center>
  );
};

export default Circles;
