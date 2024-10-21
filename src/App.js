import "./styles/globals.css";
import data from "./utils/data.json";
import React, { useState, useEffect } from "react";
import DynamicSelect from "./components/DynamicSelect";
import CustomScatter from "./components/CustomScatter";
import CustomParallel from "./components/CustomParallel";
import { CustomBubble } from "./components/CustomBubble";
import { CustomBar } from "./components/CustomBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Oval } from "react-loader-spinner";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

const Loader = () => (
  <div style={{ textAlign: "center", marginTop: "20%" }}>
    <div className="loader"></div>
    <p>Loading chart...</p>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    height: "100vh",
  },
  chartContainer: {
    flex: "1 1 50%", // Ensures two charts per row, each taking 50% width
    minWidth: "50%", // Ensures containers do not shrink below 50%
    minHeight: "50%", // Each container takes up 50% of the height
    padding: "10px", // Optional padding around the charts
    border: "1px solid #ccc", // Add border to each container
    boxSizing: "border-box", // Include padding and border in the element's width and height
    backgroundColor:"black"
  },
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it covers the entire screen
  },
};

export default class App extends React.Component{  
  constructor(props){
    super(props)
    this.state = {
      scatterFilters : {},
      parallelFilters:{},
      bubbleFilters:{},
      barFilters:{},
      dataFilters:{},
      counter:0,
      updated:false
    }
    this.loadDataFilters()
  }
 
  componentDidMount(){
    this.loadDataFilters();
  }

 loadDataFilters(){
  let d1 = {}
  let d2 = {}
  let d3 = {}
  let d4 = {}
  let d5 = {}
  for(let key in data){
    d1[data[key]['display_name']] = false
    d2[data[key]['display_name']] = false
    d3[data[key]['display_name']] = false
    d4[data[key]['display_name']] = false
    d5[data[key]['display_name']] = false
  }
  this.setState({scatterFilters:d1,
    parallelFilters:d2,
    bubbleFilters:d3,
    barFilters:d4,
    dataFilters:d5,
  })
 }

 

 updateDataFilters(){
  let d = {}
  for(let key in data){
    d[data[key]['display_name']] = false
  }
  for(let key in this.state.scatterFilters){
    if(this.state.scatterFilters[key]){
      d[key] = true
    }
  }
  for(let key in this.state.parallelFilters){
    if(this.state.parallelFilters[key]){
      d[key] = true
    }
  }
  for(let key in this.state.bubbleFilters){
    if(this.state.bubbleFilters[key]){
      d[key] = true
    }
  }
  for(let key in this.state.barFilters){
    if(this.state.barFilters[key]){
      d[key] = true
    }
  }
  this.setState({dataFilters:d}, () => {
    console.log("filtering")
  })
 }

 parallelFilterCallback(res, res2){
  let d = {}
  for(let key in data){
    d[key] = false;
  }
  let dd = {}
  for(let key in res){
    if(!res2[key]){
      for(let key2 in res[key]){
        for(let i = 0; i < res[key][key2]['identifiers'].length; i++){
          if(Object.hasOwn(dd, res[key][key2]['identifiers'][i])){
            if(!res[key][key2]['selected']){
              dd[res[key][key2]['identifiers'][i]] = false
            }
          }
          else{
            dd[res[key][key2]['identifiers'][i]] = res[key][key2]['selected']
          }
        }
      }
    }
  }
  
  for(let key in dd){
    if(dd[key]){
      d[key] = true;
    }
  }

 
  
  this.setState({parallelFilters:d}, () => {
    
   this.updateDataFilters()
   
  })
 }

 scatterFilterCallback(res){
  let d = this.state.scatterFilters
  if(res == true){
    for (let key in d){
      d[key] = false;
    }
  }
  else{
    let name = res.name;
    d[name] = !d[name]
  }
  this.setState({scatterFilters:d}, () => {

    this.updateDataFilters()
    this.setState({counter:this.state.counter+1,updated:!this.state.updated})
  })
}

bubbleFilterCallback(res){
  let d = this.state.bubbleFilters
  for (let key in d){
    d[key] = false;
  }
  for(let i = 0; i < res.length; i++){
    d[res[i]._el.$context.raw.name] = true
  }
  this.setState({bubbleFilters:d}, () => {

    this.updateDataFilters()
    this.setState({counter:this.state.counter+1,updated:!this.state.updated})
  })
}

 render(){

  return (
    <>
      
      <div style={styles.container}>
        <div style={styles.chartContainer}>
          <CustomScatter
            data={JSON.parse(JSON.stringify(data))}
            dataFilters={this.state.dataFilters}
            callback={(ret) =>{this.scatterFilterCallback(ret)}} 
          />
        </div>
        <div style={styles.chartContainer}>
          <CustomParallel data={JSON.parse(JSON.stringify(data))}
                          dataFilters={this.state.dataFilters}
                          counter={this.state.counter}
                          updated={this.state.updated}
                          callback={(ret, ret2) =>{this.parallelFilterCallback(ret, ret2)}}
          />
        </div>
        <div style={styles.chartContainer}>
          <CustomBubble data={JSON.parse(JSON.stringify(data))} callback={(ret) =>{this.bubbleFilterCallback(ret)}} dataFilters={this.state.dataFilters} />
        </div>
        <div style={styles.chartContainer}>
          <CustomBar data={JSON.parse(JSON.stringify(data))}/>
        </div>
      </div>
    </>
  );
};


}