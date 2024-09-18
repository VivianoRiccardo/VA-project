// import CustomMatrix from "../utils/Matrix"; // Adjust the path accordingly
// import React, { useState } from "react";

// export default class CustomScatter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: props.data,
//       massDisplayFlag: true,
//       stDistanceFlag: true,
//       plRadjFlag: true,
//       planetTypeFlag: true,
//       massFlag: true,
//       distanceFlag: true,
//       radjFlag: true,
//       typeFlag: true,
//       templr: 50,
//       tempmaxsteps: 1,
//       lr: 50,
//       max_steps: 1,
//     };
//     this.handleDisplayFlagChange = this.handleDisplayFlagChange.bind(this);
//     this.handleConfirmChanges = this.handleConfirmChanges.bind(this);
//   }

//   handleDisplayFlagChange = (event, click_type) => {
//     if (click_type == "mass")
//       this.setState({
//         massDisplayFlag: !this.state.massDisplayFlag,
//       });
//     else if (click_type == "distance")
//       this.setState({
//         stDistanceFlag: !this.state.stDistanceFlag,
//       });
//     else if (click_type == "radj")
//       this.setState({
//         plRadjFlag: !this.state.plRadjFlag,
//       });
//     else if (click_type == "planettype")
//       this.setState({
//         planetTypeFlag: !this.state.planetTypeFlag,
//       });
//   };

//   handleConfirmChanges() {
//     this.setState({
//       massFlag: this.state.massDisplayFlag,
//       distanceFlag: this.state.stDistanceFlag,
//       radjFlag: this.state.plRadjFlag,
//       typeFlag: this.state.planetTypeFlag,
//       lr: this.state.templr,
//       max_steps: this.state.tempmaxsteps,
//     });
//   }

//   onTodoChange(value, click_type) {
//     if (click_type == "lr")
//       this.setState({
//         templr: value,
//       });
//     else if (click_type == "max")
//       this.setState({
//         tempmaxsteps: value,
//       });
//   }

//   render() {
//     const datasetName = "Planets";
//     return (
//       <div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="massDisplayFlag"
//               checked={this.state.massDisplayFlag}
//               onClick={(e) => this.handleDisplayFlagChange(e, "mass")}
//             />
//             Mass
//           </label>
//         </div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="stDistanceFlag"
//               checked={this.state.stDistanceFlag}
//               onClick={(e) => this.handleDisplayFlagChange(e, "distance")}
//             />
//             Distance from star
//           </label>
//         </div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="plRadjFlag"
//               checked={this.state.plRadjFlag}
//               onClick={(e) => this.handleDisplayFlagChange(e, "radj")}
//             />
//             Planet radius
//           </label>
//         </div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               name="planetTypeFlag"
//               checked={this.state.planetTypeFlag}
//               onClick={(e) => this.handleDisplayFlagChange(e, "planettype")}
//             />
//             Planet Type
//           </label>
//         </div>
//         <div>
//           <label>
//             Learning Rate:
//             <input
//               type="number"
//               value={this.state.templr}
//               onChange={(e) => this.onTodoChange(e.target.value, "lr")}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Maximum Steps:
//             <input
//               type="number"
//               value={this.state.tempmaxsteps}
//               onChange={(e) => this.onTodoChange(e.target.value, "max")}
//             />
//           </label>
//         </div>
//         <button
//           onClick={() => {
//             this.handleConfirmChanges();
//           }}
//         >
//           Confirm Changes
//         </button>
//         <CustomMatrix
//           dataset={this.state.data}
//           mass_display_flag={this.state.massFlag}
//           st_distance_flag={this.state.distanceFlag}
//           pl_radj_flag={this.state.radjFlag}
//           planet_type_flag={this.state.typeFlag}
//           lr={this.state.lr}
//           max_steps={this.state.max_steps}
//         />
//       </div>
//     );
//   }
// }

import React, { useState, useEffect, useCallback } from "react";
import CustomMatrix from "../utils/Matrix"; // Adjust the import path as needed

export default class CustomScatter extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      data : props.data,
      dataFilters:props.dataFilters,
      selectedType : "planet_type",
      mass_flag : true,
      radjs_flag : true,
      pl_st_distance : true,
      planet_type : true,
      lr : 0.1,
      steps : 10,
      parentCallback:props.callback,
      showed_mass_flag : true,
      showed_radjs_flag : true,
      showed_pl_st_distance : true,
      showed_planet_type : true,
      showed_lr : 0.1,
      showed_steps : 10
    }
    this.handleDisplayFlagChange = this.handleDisplayFlagChange.bind(this);
    this.handleConfirmChanges = this.handleConfirmChanges.bind(this);
    this.onTodoChange = this.onTodoChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleResetFilter = this.handleResetFilter.bind(this);

  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataFilters !== this.props.dataFilters) {
      this.setState({ dataFilters: this.props.dataFilters });
    }
  }

  handleDisplayFlagChange(click_type){
    let mass = this.state.showed_mass_flag
    let radjs = this.state.showed_radjs_flag
    let distance = this.state.showed_pl_st_distance
    let type = this.state.showed_planet_type
    if (click_type === "mass") this.setState({showed_mass_flag:!mass});
    if (click_type === "distance") this.setState({showed_pl_st_distance:!distance});
    if (click_type === "radj") this.setState({showed_radjs_flag:!radjs});
    if (click_type === "planettype") this.setState({showed_planet_type:!type});

  };

  handleResetFilter(){
  this.state.parentCallback(true);
 }

 handleConfirmChanges(){
  let mass = this.state.showed_mass_flag
  let radjs = this.state.showed_radjs_flag
  let distance = this.state.showed_pl_st_distance
  let type = this.state.showed_planet_type
  let lr = this.state.showed_lr
  let steps = this.state.showed_steps

  this.setState(
    {
      mass_flag: mass,
      radjs_flag: radjs,
      pl_st_distance: distance,
      planet_type: type,
      lr: lr,
      steps: steps
    },
    () => {
      // This callback runs after the state has been updated
      // Now, the new state will be passed to CustomMatrix
    }
  );
 }

  onTodoChange(value, click_type){
    if (click_type === "lr") this.setState({showed_lr:value})
    if (click_type === "max")  this.setState({showed_steps:value})
  };

  handleSelectChange(e){
    this.setState({selectedType:e.target.value})
  };
  render(){
  return (
    <div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <div className="checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="massDisplayFlag"
                  checked={this.state.showed_mass_flag}
                  onChange={() => this.handleDisplayFlagChange("mass")}
                />
                Mass (J)
              </label>
            </div>
            <div className="checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="stDistanceFlag"
                  checked={this.state.showed_pl_st_distance}
                  onChange={() => this.handleDisplayFlagChange("distance")}
                />
                Star Distance (UA)
              </label>
            </div>
            <div className="checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="plRadjFlag"
                  checked={this.state.showed_radjs_flag}
                  onChange={() => this.handleDisplayFlagChange("radj")}
                />
                Radius (J)
              </label>
            </div>
            <div className="checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="planetTypeFlag"
                  checked={this.state.showed_planet_type}
                  onChange={() => this.handleDisplayFlagChange("planettype")}
                />
                Planet Types
              </label>
            </div>
          </div>
          <div>
            <select onChange={this.handleSelectChange} value={this.state.selectedType}>
              <option value={"planet_type"}>Planet Type</option>
              <option value={"pl_discmethod"}>Planet Discmethod</option>
            </select>
          </div>
        </div>
         <div style={{ display: "flex" }}>
          <div className="checkboxes">
            <label>
              Learning Rate:
              <input
                type="number"
                value={this.state.showed_lr}
                onChange={(e) => this.onTodoChange(e.target.value, "lr")}
              />
            </label>
          </div>
          <div className="checkboxes">
            <label>
              Maximum Steps:
              <input
                type="number"
                value={this.state.showed_steps}
                onChange={(e) => this.onTodoChange(e.target.value, "max")}
              />
            </label>
          </div>
        </div> 
        <button className="checkboxes" onClick={this.handleConfirmChanges}>
          Confirm Changes
        </button>
        <button className="checkboxes" onClick={this.handleResetFilter}>
          Reset Filter
        </button>
      </div>
      <div>
        <CustomMatrix
          dataset={this.state.data}
          mass_display_flag={this.state.mass_flag}
          st_distance_flag={this.state.pl_st_distance}
          pl_radj_flag={this.state.radjs_flag}
          planet_type_flag={this.state.planet_type}
          learning_rate={this.state.lr}
          max_steps={this.state.steps}
          selectedType={this.state.selectedType}
          dataFilters={this.state.dataFilters}
          callback={this.state.parentCallback}
        />
      </div>
    </div>
  );
}
};


// import { Scatter } from "react-chartjs-2";

// const prepareChartData = (data) => {
//   const chartData = {
//     datasets: [],
//   };

//   const planetTypes = {};
//   const discoveryMethods = {};

//   // Categorize data by planet_type and pl_discmethod
//   Object.values(data).forEach((planet) => {
//     const { planet_type, pl_discmethod, pl_radj, st_dist } = planet;

//     // Prepare the data for planet_type legend
//     if (!planetTypes[planet_type]) {
//       planetTypes[planet_type] = {
//         label: planet_type,
//         data: [],
//         backgroundColor: getColor(planet_type), // Adjusted opacity to 30%
//         pointStyle: "circle",
//         pointRadius: 3, // Smaller point radius
//         hoverRadius: 6, // Larger radius on hover
//         hoverBorderWidth: 2,
//         hoverBorderColor: "rgba(0, 0, 0, 0.8)",
//         datalabels: {
//           display: false,
//         },
//       };
//     }

//     // Prepare the data for pl_discmethod legend
//     if (!discoveryMethods[pl_discmethod]) {
//       discoveryMethods[pl_discmethod] = {
//         label: pl_discmethod,
//         data: [],
//         backgroundColor: getColor(pl_discmethod, 0.3), // Adjusted opacity to 30%
//         pointStyle: "triangle",
//         pointRadius: 3, // Smaller point radius
//         hoverRadius: 6, // Larger radius on hover
//         hoverBorderWidth: 2,
//         hoverBorderColor: "rgba(0, 0, 0, 0.8)",
//         datalabels: {
//           display: false,
//         },
//       };
//     }

//     // Push data into corresponding datasets
//     planetTypes[planet_type].data.push({ x: st_dist, y: pl_radj });
//     discoveryMethods[pl_discmethod].data.push({ x: st_dist, y: pl_radj });
//   });

//   // Add planet types datasets to the chart
//   Object.values(planetTypes).forEach((dataset) => {
//     chartData.datasets.push(dataset);
//   });

//   // Add discovery methods datasets to the chart
//   Object.values(discoveryMethods).forEach((dataset) => {
//     chartData.datasets.push(dataset);
//   });

//   return chartData;
// };

// // Example function to determine color based on type
// const getColor = (type) => {
//   const colors = {
//     "Gas Giant": "rgba(255, 99, 132, 0.6)",
//     "Radial Velocity": "rgba(255, 99, 132, 0.6)", // Pink
//     "Neptune-like": "rgba(54, 162, 235, 0.6)", // Light Blue
//     "Super Earth": "rgba(255, 206, 86, 0.6)", // Yellow
//     Terrestrial: "rgba(75, 192, 192, 0.6)", // Teal
//     Transit: "rgba(153, 102, 255, 0.6)", // Purple
//     "Radial Velocity": "rgba(255, 159, 64, 0.6)", // Orange
//     Microlensing: "rgba(255, 99, 71, 0.6)", // Tomato Red
//     Imaging: "rgba(46, 204, 113, 0.6)", // Green
//     "Eclipse Timing Variations": "rgba(231, 76, 60, 0.6)", // Red
//     "Pular Timing": "rgba(52, 152, 219, 0.6)", // Blue
//   };
//   return colors[type] || "rgba(75, 192, 192, 0.6)";
// };

// const CustomScatter = ({ data }) => {
//   const chartData = prepareChartData(data);
//   console.log(chartData);
//   const options = {
//     scales: {
//       x: {
//         title: { display: false, text: "Distance from Star (AU)" },
//         type: "logarithmic",
//       },
//       y: {
//         title: { display: false, text: "Radius (Jupiter Radii)" },
//         type: "logarithmic",
//       },
//     },
//     plugins: {
//       zoom: {
//         pan: {
//           enabled: true,
//           mode: "xy",
//         },
//         zoom: {
//           enabled: true,
//           mode: "xy",
//         },
//       },
//       tooltip: {},
//     },
//     elements: {
//       point: {
//         pointStyle: "circle",
//         hoverBorderWidth: 2,
//         hoverBorderColor: "rgba(0, 0, 0, 0.8)",
//       },
//     },
//   };
//   return <Scatter data={chartData} options={options} />;
// };

// export default CustomScatter;
