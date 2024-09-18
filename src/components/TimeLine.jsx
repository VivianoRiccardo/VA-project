import React from "react";

const Timeline = ({
  points,
  dates,
  scrollPosition,
  onPointClick,
  onTimelineButtonClick,
}) => {
  return (
    <center>
      <div className="scroll-content">
        {points.map((point, index) => (
          <div
            key={index}
            className="scroll-date"
            style={{
              left: `${point}px`,
              color: index === scrollPosition ? "white" : "black", // Highlight current scroll point
            }}
            onClick={() => onPointClick(point)}
          >
            {dates[index]}
          </div>
        ))}
      </div>
      <div>
        <button onClick={onTimelineButtonClick}>Change Date Colors</button>
      </div>
    </center>
  );
};

export default Timeline;
