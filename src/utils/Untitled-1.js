import { Matrix } from "ml-matrix";
import React from "react";
import computeMDS from "./simple_mds";
import _ from 'lodash';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { toDimension } from "chart.js/helpers";
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
  zoomPlugin
);
function print_shit(e, array) {
  console.log(e);
  console.log(array);
}
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels
);
function rescaling_list(lista) {
  let minimum = Math.min.apply(Math, lista);
  let maximum = Math.max.apply(Math, lista);
  lista.map((item, index) => {
    return (lista[index] = (item - minimum) / (maximum - minimum));
  });
  return lista;
}
export function getMatrixElements(dataset, type = "planet_type") {
  /* create matrix*/
  let names = [];
  let planets_type = [];
  let pl_discmethod = [];
  let masses_display = [];
  let st_distances = [];
  
  let own_st_distances = [];
  
  let stellar_type = [];
  let number_of_planets = [];
  let pl_radj = [];
  let discovery_date = [];
  let star_mass = []
  /*planet types:
     Super Earth"
     "Gas Giant"
     "Neptune-like"
     "Terrestrial"
     "Unknown"*/
  let temp_names = [];

  for (let i in dataset) {
    names.push(dataset[i]["display_name"]);
    if (!temp_names.includes(dataset[i][type])) {
      temp_names.push(dataset[i][type]);
    }
    //if (type === "planet_type") {
      planets_type.push(dataset[i]["planet_type"]);
    //} else {
      pl_discmethod.push(dataset[i]["pl_discmethod"]);
    //}
    masses_display.push(dataset[i]["mass_display"]);
    st_distances.push(dataset[i]["st_dist"]);
    own_st_distances.push(dataset[i]["ua"]);
    number_of_planets.push(dataset[i]["number_of_planets"])
    let type2 =dataset[i]["stellar_type"];
    if(dataset[i]["stellar_type"] == "T"){
      type2 = "(T) 500–1,500 K";
    }
    if(dataset[i]["stellar_type"] == "M"){
      type2 = "(M) 2,400–3,700 K";
    }
    if(dataset[i]["stellar_type"] == "K"){
      type2 = "(K) 3,700–5,200 K";
    }
    if(dataset[i]["stellar_type"] == "G"){
      type2 = "(G) 5,200–6,000 K";
    }
    if(dataset[i]["stellar_type"] == "F"){
      type2 = "(F) 6,000–7,500 K";
    }
    if(dataset[i]["stellar_type"] == "A"){
      type2 = "(A) 7,500–10,000 K";
    }
    if(dataset[i]["stellar_type"] == "B"){
      type2 = "(B) 10,000–30,000 K";
    }
    if(dataset[i]["stellar_type"] == "O"){
      type2 = "(O) 30,000–50,000 K";
    }
    stellar_type.push(type2)
    star_mass.push(dataset[i]["st_mass"])
    discovery_date.push(parseInt(dataset[i]["discovery_date"]));
    pl_radj.push(dataset[i]["pl_radj"]);
  }


  masses_display.map((item, index) => {
    let number1 = item.split(" ");
    let type1 = number1[1];
    number1 = parseFloat(number1[0]);
    if (type1 === "Earths") number1 /= 317.8;
    masses_display[index] = number1;
  });
  st_distances.map((item, index) => {
    st_distances[index] = parseFloat(item);
  });

  pl_radj.map((item, index) => {
    pl_radj[index] = parseFloat(item);
  });
  const final_l = [];
  names.map((item, index) => {
    final_l.push([
      names[index],
      planets_type[index],
      masses_display[index],
      st_distances[index],
      pl_radj[index],
      pl_discmethod[index],
      own_st_distances[index],
      stellar_type[index],
      number_of_planets[index],
      star_mass[index]
    ]);
  });

  const returnData = {
    names: names,
    discovery_date: discovery_date,
    masses_display: masses_display,
    st_distances: st_distances,
    pl_radj: pl_radj,
    planets_type:planets_type,
    pl_discmethod:pl_discmethod,
    ua:own_st_distances,
    stellar_type:stellar_type,
    star_mass:star_mass,
    number_of_planets:number_of_planets
  };
  /*if (type === "planet_type") {
    returnData["planets_type"] = planets_type;
  } else {
    returnData["pl_discmethod"] = pl_discmethod;
  }*/

  return {
    ...returnData,
  };
}
export function getListNames(dataset) {
  /* create matrix*/
  let names = [];
  let planets_type = [];
  let masses_display = [];
  let st_distances = [];
  let pl_radj = [];
  /*planet types:
     Super Earth"
     "Gas Giant"
     "Neptune-like"
     "Terrestrial"
     "Unknown"*/
  for (let i in dataset) {
    names.push(dataset[i]["display_name"]);
  }
  return names;
}
function getDifferenceMatrix(
  dataset,
  mass_display_flag = true,
  st_distance_flag = true,
  pl_radj_flag = true,
  planet_type_flag = true
) {
  /*console.log("wewe1");
  console.log(mass_display_flag)
  console.log(st_distance_flag)
  console.log(pl_radj_flag)
  console.log(planet_type_flag)
  console.log("wewe2");*/
  /* create matrix*/
  let names = [];
  let planets_type = [];
  let masses_display = [];
  let st_distances = [];
  let pl_radj = [];
  let all_planets_type = [];
  let distance_matrix = [];
  let labels_name = [];
  /*planet types:
  Super Earth"
  "Gas Giant"
  "Neptune-like"
  "Terrestrial"
  "Unknown"*/
  let differences = {};
  differences["Terrestrial"] = 0;
  differences["Super Earth"] = 0.33;
  differences["Neptune-like"] = 0.66;
  differences["Gas Giant"] = 1;
  for (let i in dataset) {
    names.push(dataset[i]["display_name"]);
    planets_type.push(dataset[i]["planet_type"]);
    masses_display.push(dataset[i]["mass_display"]);
    st_distances.push(dataset[i]["st_dist"]);
    pl_radj.push(dataset[i]["pl_radj"]);
    if (!all_planets_type.includes(dataset[i]["planet_type"])) {
      all_planets_type.push(dataset[i]["planet_type"]);
    }
  }
  //console.log(all_planets_type)
  let temp_distance = [];
  let temp_radj = [];
  let temp_mass = [];
  // rescaling all the values
  masses_display.map((item, index) => {
    let number1 = item.split(" ");
    let type1 = number1[1];
    number1 = parseFloat(number1[0]);
    if (type1 === "Jupiters") number1 *= 317.8;
    masses_display[index] = number1;
  });
  st_distances.map((item, index) => {
    st_distances[index] = parseFloat(item);
  });
  pl_radj.map((item, index) => {
    pl_radj[index] = parseFloat(item);
  });
  let rescaled_masses_display = rescaling_list(masses_display);
  let rescaled_st_distances = rescaling_list(st_distances);
  let rescaled_pl_radj = rescaling_list(pl_radj);
  names.map((item, index) => {
    let l = [];
    labels_name.push(names[index]);
    if (planets_type[index] != "Unknown") {
      names.map((item2, index2) => {
        if (planets_type[index2] != "Unknown") {
          let temp_st_distance = parseFloat(
            rescaled_st_distances[index] - rescaled_st_distances[index2]
          );
          temp_st_distance *= temp_st_distance;
          let temp_pl_radj = parseFloat(
            rescaled_pl_radj[index] - rescaled_pl_radj[index2]
          );
          temp_pl_radj *= temp_pl_radj;
          let temp_mass =
            rescaled_masses_display[index] - rescaled_masses_display[index2];
          temp_mass *= temp_mass;
          let numerical_values_distances = 0;
          if (mass_display_flag) numerical_values_distances += temp_mass;
          if (st_distance_flag) numerical_values_distances += temp_st_distance;
          if (pl_radj_flag) numerical_values_distances += temp_pl_radj;
          numerical_values_distances = Math.sqrt(numerical_values_distances);
          let categorical_values_distance = 0;
          if (planets_type[index] != planets_type[index2]) {
            categorical_values_distance =
              differences[planets_type[index]] -
              differences[planets_type[index2]];
            if (categorical_values_distance < 0)
              categorical_values_distance *= -1;
          }/*
          categorical_values_distance = 1;
          if (!planet_type_flag) categorical_values_distance = 0;
          l.push(numerical_values_distances + categorical_values_distance);*/
          l.push(1+numerical_values_distances);
        }
      });
      distance_matrix.push(l);
    }
  });
  return [labels_name, distance_matrix];
}
// function getFinalMatrix(
//   dataset,
//   mass_display_flag = true,
//   st_distance_flag = true,
//   pl_radj_flag = true,
//   planet_type_flag = true,
//   lr = 50,
//   max_steps = 3
// ) {
//   let returning_values = getDifferenceMatrix(
//     dataset,
//     mass_display_flag,
//     st_distance_flag,
//     pl_radj_flag,
//     planet_type_flag
//   );
//   let distance_matrix = new Matrix(returning_values[1]);
//   let d = getMdsCoordinatesWithGradientDescent(distance_matrix, lr, max_steps)
//     .coordinates.data;
//   //let d = reduceDimensionsPCA(distance_matrix)
//   //let d = computeMDS(distance_matrix);
//   let data_list = [];
//   d.map((item) => {
//     let i = { x: item[0], y: item[1] };
//     data_list.push(i);
//   });
//   let data = {
//     labels: returning_values[0], // a list of labels
//     datasets: [
//       {
//         data: data_list,
//         backgroundColor: "rgba(255, 99, 132, 1)",
//         datalabels: {
//           display: false, // This disables displaying values near data points
//         },
//         legend: {
//           display: false,
//         },
//       },
//     ],
//   };
//   const options = {
//     legend: {
//       display: false,
//     },
//     onClick: print_shit,
//   };
//   const plugin = {
//     datalabels: {
//       display: false,
//     },
//   };
//   return [options, data, plugin];
// }
// export default class CustomMatrix extends Component {
//   // shouldComponentUpdate(nextProps, nextState) {
//   //   // Only re-render if specific props or state changes
//   //   if (
//   //     Object.values(nextProps.dataset).length !==
//   //       Object.values(this.props.dataset).length ||
//   //     nextProps.mass_display_flag !== this.props.mass_display_flag ||
//   //     nextProps.planet_type_flag !== this.props.planet_type_flag ||
//   //     nextProps.learning_rate !== this.props.learning_rate ||
//   //     nextProps.max_steps !== this.props.max_steps ||
//   //     nextProps.pl_radj_flag !== this.props.pl_radj_flag ||
//   //     nextProps.st_distance_flag !== this.props.st_distance_flag
//   //   ) {
//   //     return true;
//   //   }
//   //   return false;
//   // }
//   constructor(props) {
//     super(props);
//     this.state = { loader: false };
//   }
//   render() {
//     let l = getFinalMatrix(
//       this.props.dataset,
//       this.props.mass_display_flag,
//       this.props.st_distance_flag,
//       this.props.pl_radj_flag,
//       this.props.planet_type_flag,
//       this.props.learning_rate,
//       this.props.max_steps
//     );
//     if (this.state.loader) {
//       return <>loader.......</>;
//     }
//     return (
//       <Scatter
//         options={l[0]}
//         data={l[1]}
//         plugins={[l[2]]}
//         fallbackContent={<>Loading.....</>}
//       />
//     );
//   }
// }
function getFinalMatrix(
  dataset,
  mass_display_flag = true,
  st_distance_flag = true,
  pl_radj_flag = true,
  planet_type_flag = true,
  lr = 50,
  max_steps = 3
) {
  //console.log("hey")
  const returning_values = getDifferenceMatrix(
    dataset,
    mass_display_flag,
    st_distance_flag,
    pl_radj_flag,
    planet_type_flag
  );
  const distance_matrix = returning_values[1];
  // let d = null;
  // if (max_steps > 0) {
  let d = computeMDS(distance_matrix,lr,max_steps)
  // } else {
  //   // Handle the case where max_steps is 0
  //   d = computeMDS(distance_matrix); // or another fallback
  // }
  const data_list = new Array(d.length);
  for (let i = 0; i < d.length; i++) {
    data_list[i] = { x: d[i][0], y: d[i][1], name:returning_values[0][i] };
  }
  return data_list;
  const data = {
    labels: returning_values[0],
    datasets: [
      {
        data: data_list,
        backgroundColor: "rgba(255, 99, 132, 1)",
        datalabels: { display: false },
        legend: { display: false },
      },
    ],
  };
  const options = {
    legend: { display: false },
    onClick: print_shit,
  };
  const plugin = {
    datalabels: { display: false },
  };
  return [options, data, plugin];
}
export default class CustomMatrix extends React.Component {
  constructor(props) {
         super(props);
         let d = getFinalMatrix(props.dataset,props.mass_display_flag,props.st_distance_flag,props.pl_radj_flag,props.planet_type_flag,props.learning_rate,props.max_steps);
         this.state = {
           dataset: props.dataset,
           mass_display_flag: props.mass_display_flag,
           st_distance_flag: props.st_distance_flag,
           pl_radj_flag: props.pl_radj_flag,
           planet_type_flag: props.planet_type_flag,
           learning_rate: props.learning_rate,
           max_steps: props.max_steps,
           selectedType:props.selectedType,
           dataFilters:props.dataFilters,
           parentCallback:props.callback,
           chartData:this.prepareChartData(props.dataset,d,props.selectedType,props.learning_rate,props.max_steps, props.mass_display_flag,props.st_distance_flag,props.pl_radj_flag,props.planet_type_flag,props.dataFilters),
           distances:d,
           chartDataDistances:{},
           compute:false,
           selectedPoints: [],
         };
         
       }
       componentDidMount(){
        this.setChartData();
       }
       componentDidUpdate(prevProps, prevState) {
        // Avoid calling setState if chartData hasn't actually changed
        let chartDataHasChanged = !_.isEqual(this.state.dataFilters,prevState.dataFilters);
        
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.learning_rate,prevState.learning_rate))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.mass_display_flag,prevState.mass_display_flag))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.st_distance_flag,prevState.st_distance_flag))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.pl_radj_flag,prevState.pl_radj_flag))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.planet_type_flag,prevState.planet_type_flag))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.max_steps,prevState.max_steps))
        }
        if(!chartDataHasChanged){
          chartDataHasChanged = (!_.isEqual(this.state.selectedType,prevState.selectedType))
        }
        if (chartDataHasChanged) {
          this.setChartData();
        }
      }
       
       setChartData(){
        let d=this.state.distances;
        if(this.state.compute){
          d = getFinalMatrix(this.state.dataset,this.state.mass_display_flag,this.state.st_distance_flag,this.state.pl_radj_flag,this.state.planet_type_flag,this.state.learning_rate,this.state.max_steps)
        }
        this.setState({chartData: this.prepareChartData(this.state.dataset,d,this.state.selectedType,this.state.learning_rate,this.state.max_steps, this.state.mass_display_flag,this.state.st_distance_flag,this.state.pl_radj_flag,this.state.planet_type_flag,this.state.dataFilters)})
       }
       shouldComponentUpdate(nextProps, nextState) {
        // Deep comparison for dataFilters
        const dataFiltersChanged = !_.isEqual(nextProps.dataFilters, this.props.dataFilters);
        
        // Deep comparison for chartData
        const chartDataChanged = !_.isEqual(nextState.chartData, this.state.chartData);
        return (
          nextProps.mass_display_flag !== this.props.mass_display_flag || 
          nextProps.st_distance_flag !== this.props.st_distance_flag || 
          nextProps.pl_radj_flag !== this.props.pl_radj_flag || 
          nextProps.planet_type_flag !== this.props.planet_type_flag || 
          nextProps.learning_rate !== this.props.learning_rate || 
          nextProps.selectedType !== this.props.selectedType ||
          nextProps.max_steps !== this.props.max_steps || 
          dataFiltersChanged || 
          chartDataChanged
        );
      }
      
      static getDerivedStateFromProps(nextProps, prevState) {
        
        let flag = !_.isEqual(nextProps.dataFilters, prevState.dataFilters);
        if(flag && nextProps.mass_display_flag === prevState.mass_display_flag && 
          nextProps.st_distance_flag === prevState.st_distance_flag && 
          nextProps.pl_radj_flag === prevState.pl_radj_flag && 
          nextProps.planet_type_flag === prevState.planet_type_flag && 
          nextProps.learning_rate === prevState.learning_rate && 
          nextProps.selectedType === prevState.selectedType &&
          nextProps.max_steps === prevState.max_steps){
            return {dataFilters:nextProps.dataFilters, compute:false}
          }
        else if(
          flag ||
          nextProps.mass_display_flag !== prevState.mass_display_flag || 
          nextProps.st_distance_flag !== prevState.st_distance_flag || 
          nextProps.pl_radj_flag !== prevState.pl_radj_flag || 
          nextProps.planet_type_flag !== prevState.planet_type_flag || 
          nextProps.learning_rate !== prevState.learning_rate || 
          nextProps.selectedType !== prevState.selectedType ||
          nextProps.max_steps !== prevState.max_steps || flag
        ) {
          return {
            mass_display_flag: nextProps.mass_display_flag,
            st_distance_flag: nextProps.st_distance_flag,
            pl_radj_flag: nextProps.pl_radj_flag,
            planet_type_flag: nextProps.planet_type_flag,
            learning_rate: nextProps.learning_rate,
            max_steps: nextProps.max_steps,
            selectedType: nextProps.selectedType,
            dataFilters:nextProps.dataFilters,
            compute:false,
            distances:getFinalMatrix(nextProps.dataset,nextProps.mass_display_flag,nextProps.st_distance_flag,nextProps.pl_radj_flag,nextProps.planet_type_flag,nextProps.learning_rate,nextProps.max_steps)
          };
        }
        // No state change required
        return null;
      }
  prepareChartData (data,distances,selectedType, lr, max_steps, mass_display_flag = true,
    st_distance_flag = true,
    pl_radj_flag = true,
    planet_type_flag = true, dataFilters){
    const chartData = {
      datasets: [],
    };
    const planetTypes = {};
    const discoveryMethods = {};
    // Categorize data by planet_type and pl_discmethod
    Object.values(data).forEach((planet) => {
      const { planet_type, pl_discmethod, pl_radj, st_dist, display_name} = planet;
      // Prepare the data for planet_type legend
      let bc =  'rgba(255, 0, 0, 1)';
      if (!planetTypes[planet_type] && selectedType === "planet_type") {
        
        planetTypes[planet_type] = {
          label: planet_type,
          data: [],
          backgroundColor: this.getColor(planet_type,0.4), // Adjusted opacity to 30%
          pointStyle: "circle",
          pointRadius: 3, // Smaller point radius
          hoverRadius: 6, // Larger radius on hover
          hoverBorderWidth: 2,
          hoverBorderColor: "rgba(0, 0, 0, 0.8)",
          datalabels: {
            display: false,
          },
          pointBorderColor: (ctx) => {
            const index = ctx.dataIndex;
            const point = ctx.dataset.data[index];
            return point.borderColor || this.getColor(planet_type,0.4); // Default to black if not set
          },
          pointBorderWidth: (ctx) => {
            const index = ctx.dataIndex;
            const point = ctx.dataset.data[index];
            return point.borderWidth || 1; // Default to 1 if not set
          },
        };
      }
      // Prepare the data for pl_discmethod legend
      if (
        !discoveryMethods[pl_discmethod] &&
        selectedType === "pl_discmethod"
      ) {
        
        
        discoveryMethods[pl_discmethod] = {
          label: pl_discmethod,
          data: [],
          backgroundColor: this.getColor(pl_discmethod,0.4), // Adjusted opacity to 30%
          pointStyle: "circle",
          pointRadius: 3, // Smaller point radius
          hoverRadius: 6, // Larger radius on hover
          hoverBorderWidth: 2,
          hoverBorderColor: "rgba(0, 0, 0, 0.8)",
          datalabels: {
            display: false,
          },
          pointBorderColor: (ctx) => {
            const index = ctx.dataIndex;
            const point = ctx.dataset.data[index];
            return point.borderColor || this.getColor(pl_discmethod,0.4); // Default to black if not set
          },
          pointBorderWidth: (ctx) => {
            const index = ctx.dataIndex;
            const point = ctx.dataset.data[index];
            return point.borderWidth || 1; // Default to 1 if not set
          },
        };
      }
      // Push data into corresponding datasets
      if(selectedType === "planet_type"){
        if(dataFilters[display_name] === undefined || dataFilters[display_name] == false){
          bc =  this.getColor(planet_type,0.4);
        }
          distances.some((item) => {
            if(item.name == display_name){
              planetTypes[planet_type].data.push({ x: item.x, y: item.y,name:display_name, borderColor: bc, borderWidth: 1 });
              return;
            }
          })
      }
      if(selectedType === "pl_discmethod"){
        if(dataFilters[display_name] === undefined || dataFilters[display_name] == false){
          bc =  this.getColor(pl_discmethod,0.4);
        }
        distances.some((item) => {
          if(item.name == display_name){
            discoveryMethods[pl_discmethod].data.push({ x: item.x, y: item.y,name:display_name, borderColor: bc, borderWidth: 1 });
            return;
          }
        })
      }
    });
    // Add planet types datasets to the chart
    Object.values(planetTypes).forEach((dataset) => {
      chartData.datasets.push(dataset);
    });
    // Add discovery methods datasets to the chart
    Object.values(discoveryMethods).forEach((dataset) => {
      chartData.datasets.push(dataset);
    });
    return chartData;
    
  };
  // Example function to determine color based on type
  getColor(type, opacity){
    opacity = opacity.toString()
    const colors = {
      "Gas Giant": "rgba(123,50,148,"+opacity+")",
      "Neptune-like": "rgba(194,165,207,"+opacity+")", // Light Blue
      "Super Earth": "rgba(166,219,160,"+opacity+")", // Yellow
      "Terrestrial": "rgba(0,136,55,"+opacity+")", // Teal
      "Transit":"rgba(64,0,75,"+opacity+")",
      "Radial Velocity":"rgba(118,42,131,"+opacity+")",
      "Transit Timing Variations":"rgba(153,112,171,"+opacity+")",
      "Microlensing":"rgba(194,165,207,"+opacity+")",
      "Imaging":"rgba(231,212,232,"+opacity+")",
      "Eclipse Timing Variations":"rgba(217,240,211,"+opacity+")",
      "Pulsar Timing":"rgba(166,219,160,"+opacity+")",
      "Pulsation Timing Variations":"rgba(90,174,97,"+opacity+")",
      "Disk Kinematics":"rgba(27,120,55,"+opacity+")",
      "Orbital Brightness Modulation":"rgba(0,68,27,"+opacity+")",
    };
    return colors[type] || "rgba(75, 192, 192, 0.6)";
  };
  
  render(){
  const options = {
    scales: {
      x: {
        title: { display: false, text: "Distance from Star (AU)" },
        type: "linear",
        grid: {
          display: false, // Removes grid lines on the x-axis
        },
        ticks: {
          display: false,
          
        },
      },
      y: {
        title: { display: false, text: "Radius (Jupiter Radii)" },
        type: "linear",
        grid: {
          display: false, // Removes grid lines on the x-axis
        },
        ticks: {
          display: false,
          
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true // SET SCROOL ZOOM TO TRUE
          },
          mode: "xy",
          speed: 100
        },
        pan: {
          enabled: true,
          mode: "xy",
          speed: 100
        }
      },
      tooltip: {
        callbacks: {
         label: (yDatapoint) => {return (yDatapoint.raw)},
        }
      }
    },
    onClick: (event, elements) => {
      const chart = event.chart;
  
      // Get the data point that was clicked
      const activeElement = chart.getElementsAtEventForMode(
        event.native, // The event from the click
        "nearest", // The mode to search for points
        { intersect: true }, // Only count clicks directly on points
        false // Avoid multiple data points
      );
  
      if (activeElement.length > 0) {
        // Get the clicked point data
        const datasetIndex = activeElement[0].datasetIndex;
        const index = activeElement[0].index;
  
        const clickedPoint = chart.data.datasets[datasetIndex].data[index];
  
        // Call your click handler function
        this.state.parentCallback(clickedPoint);
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        pointStyle: "circle",
        hoverBorderWidth: 2,
        hoverBorderColor: "rgba(0, 0, 0, 0.8)",
      },
    },
   
  };
  return (
    <div>
    <div className="scatter_chart">
      {this.state.chartData.datasets?.length > 0 && (
        <Scatter data={this.state.chartData} options={options} className="scatter_chart" />
      )}
      
    </div>
    </div>
    
  );}
};