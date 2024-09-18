import React from "react";
import CustomScatter from "./CustomScatter";
import CustomParallel from "./CustomParallel";
import { CustomBubble } from "./CustomBubble";
import { CustomBar } from "./CustomBar";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register necessary Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );
const Charts = ({ data, setLoading }) => {
  console.log("-----------------------------");
  console.log(new Date().toLocaleString(), data);
  console.log("-----------------------------");

  return (
    <div className="dashboard">
      <div className="chart-container">
        <CustomScatter data={data} />
      </div>
      <div className="chart-container">
        {/* <CustomParallel data={data} /> */}
      </div>
      <div className="chart-container">
        {/* <CustomBubble data={data} setLoading={setLoading} /> */}
      </div>
      <div className="chart-container">{/* <CustomBar data={data} /> */}</div>
    </div>
  );
};

// Wrap Charts with React.memo for optimization
export default Charts;
