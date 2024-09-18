import plugin from 'chartjs-plugin-datalabels';
import React, { createRef } from 'react';
import { Bubble } from 'react-chartjs-2';
import _ from 'lodash';
import {
  Chart as ChartJS,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
  zoomPlugin
);

export class CustomBubble extends React.Component {
    constructor(props) {
      super(props);
      
      let l = this.turnDataToMenagableData(props.data);



      this.state = {
        dataFilters:props.dataFilters,
        data : props.data,
        parentCallback:props.callback,
        sorted_data : l[0],
        radius: 'pl_massj',
        xAxis: 'pl_radj',
        yAxis : 'st_dist',
        axis_names: {'pl_massj': "MASS (J)", "pl_radj": "RADIUS (J)", "st_dist":"STAR DISTANCE (AU)"},
        reverse_axis_names: {"MASS (J)":'pl_massj', "RADIUS (J)":"pl_radj", "STAR DISTANCE (AU)":"st_dist"},
        different_planets : l[1].length,
        colors : ["rgba(123,50,148,0.7)","rgba(194,165,207,0.7)", "rgba(166,219,160,0.7)", "rgba(0,136,55,0.7)", 'rgba(0,128,0,0.5)'],
        labels : l[1],
        temp_planet_type_labels:l[1],
        temp_disc_method_labels:l[3],
        temp_planet_type_colors:["rgba(123,50,148,0.7)","rgba(194,165,207,0.7)", "rgba(166,219,160,0.7)", "rgba(0,136,55,0.7)", 'rgba(0,128,0,0.5)'],
        temp_disc_method_colors:["rgba(64,0,75,0.7)","rgba(118,42,131,0.7)","rgba(153,112,171,0.7)","rgba(194,165,207,0.7)","rgba(231,212,232,0.7)",
                                "rgba(217,240,211,0.7)","rgba(166,219,160,0.7)","rgba(90,174,97,0.7)","rgba(27,120,55,0.7)","rgba(0,68,27,0.7)"],
        date:2015,
        selectedType:"planet_type",
        dates : l[2],
        sizes : [0.1,1,10,20],
        sizes_dict : {"pl_massj":[0.1,1,10,20],"pl_radj":[0.01,2,3,10],"st_dist":[5000,10000,20000,300000]},
        circles_radius : [3.175, 3.175+5.575, 3.175+5.575+5.575, 3.175+5.575+5.575+5.575],
        multiplier_circle:1.15,
        select1Value: 'RADIUS (J)',
        select2Value: 'STAR DISTANCE (AU)',
        select3Value: 'MASS (J)',
        xselect1: ['RADIUS (J)', 'STAR DISTANCE (AU)','MASS (J)'],
        yselect1: ['STAR DISTANCE (AU)', 'RADIUS (J)', 'MASS (J)'],
        radiusselect1: ['MASS (J)','STAR DISTANCE (AU)', 'RADIUS (J)'],
        scrollPosition: 0,
        points :l[2],
        keepgoing : false,
        inTimeout : false,
        selection: null,
        playInterval: null,

      }
      this.chartRef = createRef()
      this.timelineRef = this.chartRef;
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSelectChange = this.handleSelectChange.bind(this);
      this.onPointClick = this.onPointClick.bind(this);
      this.onTimelineButtonClick = this.onTimelineButtonClick.bind(this);
      this.goOnWithscrollPosition = this.goOnWithscrollPosition.bind(this);
      this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);

    }

  turnDataToMenagableData(statedata){
    let stateDate = [];
    let stateLabels = [];
    let stateLabels2 = [];
    let keys = Object.keys(statedata).sort();
    for(let i = 0; i < keys.length; i++){
      if(!stateDate.includes(parseInt(statedata[keys[i]]['discovery_date'])))
        stateDate.push(parseInt(statedata[keys[i]]['discovery_date']))
      if(!stateLabels.includes(statedata[keys[i]]['planet_type']))
        stateLabels.push(statedata[keys[i]]['planet_type'])
      if(!stateLabels2.includes(statedata[keys[i]]['pl_discmethod']))
        stateLabels2.push(statedata[keys[i]]['pl_discmethod'])
    }
    stateDate.sort();
    let data = [];
    for(let i = 0; i < stateDate.length; i++){
      data.push([])
    }
    for(let i = 0; i < keys.length; i++){
      let index = stateDate.indexOf(parseInt(statedata[keys[i]]['discovery_date']))
      data[index].push(statedata[keys[i]]);
    }
    return [data,stateLabels,stateDate, stateLabels2];
  }

  setAxis(xAxis,yAxis,radius){
    let l = this.state.sizes_dict;
    let l2 = l[radius]
    this.setState({xAxis:xAxis,yAxis:yAxis,radius:radius,sizes:l2,sizes:this.state.sizes_dict[radius]})
  }

  changeDate(new_date){
    this.setState({date:new_date});
  }



  static getDerivedStateFromProps(nextProps, prevState) {
        

    let flag = !_.isEqual(nextProps.dataFilters, prevState.dataFilters);
    if(flag) 
        return {dataFilters:nextProps.dataFilters}
    return null;
  }

  getDataset(){
          const customLabels = []


          // SET THE DATASET OF THE DATE EACH DATASET FOR EACH PLANET TYPE   
          let data_tot = []
          for(let j = 0; j < this.state.different_planets; j++){
            let data1 = [];
            let l_radius = []
            for(let i = 0; i < this.state.sorted_data[this.state.dates.indexOf(this.state.date)].length; i++){
              if( this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.selectedType] == this.state.labels[j]){
                let flag = true;
                for(let k = 0; k < this.state.sizes.length-1; k++){
                  if(1*this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.radius] <= this.state.sizes[k]){
                    l_radius.push(this.state.multiplier_circle*this.state.circles_radius[k])
                    flag = false
                    break;
                    }
                  }
                  if(flag){
                    l_radius.push(this.state.multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1])
                  }
                
              }

            }
            let count = 0;
            for(let i = 0; i < this.state.sorted_data[this.state.dates.indexOf(this.state.date)].length; i++){
              if( this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.selectedType] == this.state.labels[j]){
                
                customLabels.push(this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]['display_name'])
                if(this.state.dataFilters[this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"]]){
                  data1.push({borderColor: 'red',    // Red border for this point
                    borderWidth: 1, 
                    name: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"],
                     x: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.xAxis],
                     y: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.yAxis],
                     r: l_radius[count]})
                }
                else{
                  data1.push({ borderWidth: 0, borderColor: 'red',    // Red border for this point
                    name: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"],
                     x: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.xAxis],
                     y: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.yAxis],
                     r: l_radius[count]})
                }
                count++;
              }
            }
            
            let dict = {label:this.state.labels[j],backgroundColor: this.state.colors[j],datalabels: {
              display: false // This disables displaying values near data points
            },data : data1};
            data_tot.push(dict);
          }
          return [customLabels,data_tot]
  }

  handleSelectChange(select, value){
    let first = this.state.select1Value;
    let second = this.state.select2Value;
    let third = this.state.select3Value;

    if(select === 'select1'){
      if(second === value)
        second = first;
      else if(third === value)
        third = first;
      first = value;          
    }

    if(select === 'select2'){
      if(first === value)
        first = second;
      else if(third === value)
        third = second;
      second = value;          
    }

    if(select === 'select3'){
      if(first === value)
        first = third;
      else if(second === value)
        second = third;
      third = value;          
    }



    this.setState({ select1Value:first,select2Value:second,select3Value:third });
    this.setAxis(this.state.reverse_axis_names[first],this.state.reverse_axis_names[second],this.state.reverse_axis_names[third])
  }


  handleInputChange(event){
      try{
      const value = event.target.value.toString();
      if(value === "")
        return;
      const value_f = parseFloat(value);
      const index = parseInt(event.target.id);
      if(value.charAt(0) === '0'){
        if(value.includes('.') && value.length > 2){
          let l = this.state.sizes;
          l[index] = value_f;
          this.setState({sizes:l})
        }
      }
      else{
        let l = this.state.sizes;
        l[index] = value_f;
        this.setState({sizes:l})
      }
      }
      catch{
        return;
      }

    
    

  }

  

  handleSelectLabelChange(e){
    if(e.target.value == "pl_discmethod")
    this.setState({different_planets:this.state.temp_disc_method_labels.length, labels:this.state.temp_disc_method_labels,colors:this.state.temp_disc_method_colors,selectedType:e.target.value},() =>{
})
    else
    
    this.setState({different_planets:this.state.temp_planet_type_labels.length,labels:this.state.temp_planet_type_labels,colors:this.state.temp_planet_type_colors,selectedType:e.target.value})
  };


  getInputAxis(){
    return(<div style={{ display: "flex", justifyContent: "space-between" }} ><center className="circle-container">
      <div>
        <label>X</label>
        <select
          value={this.state.select1Value}
          onChange={(e) =>
            this.handleSelectChange('select1', e.target.value)
          }
        >
          {this.state.xselect1.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Y</label>
        <select
          value={this.state.select2Value}
          onChange={(e) =>
            this.handleSelectChange('select2', e.target.value)
          }
          disabled={this.state.select1Value === ''}
        >
          {this.state.yselect1.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Size</label>
        <select
          value={this.state.select3Value}
          onChange={(e) =>
            this.handleSelectChange('select3', e.target.value)
          }
          disabled={this.state.select1Value === ''}
        >
          {this.state.radiusselect1.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </center>
          <div>
            <select onChange={this.handleSelectLabelChange} value={this.state.selectedType}>
              <option value={"planet_type"}>Planet Type</option>
              <option value={"pl_discmethod"}>Planet Discmethod</option>
            </select>
          </div>
    </div>)
  }


  onPointClick(e){
    this.setState({keepgoing:false})
    //while(!this.state.inTimeout);
    this.setState({scrollPosition:this.state.points.indexOf(e),date:e})
  }


  goOnWithscrollPosition(){
    let scrollPosition = this.state.scrollPosition;
    if(scrollPosition >= this.state.points.length-1){
      scrollPosition = this.state.points.length-1;
      this.setState({keepgoing:false})
      return
    }
    else
      scrollPosition++;
    this.setState({scrollPosition:scrollPosition,date:this.state.points[scrollPosition]})
  }



  onTimelineButtonClick(callback) {
    this.setState({keepgoing:true,inTimeout:true})
    const interval = setInterval(() => {
      if(!this.state.keepgoing){
        clearInterval(interval)
      }
      else{
      callback();
      }
    }, 1500);
    this.setState({inTimeout:false})
  
  }

  getTimeline(){
    return (<center>
      <button onClick={()=>{this.onTimelineButtonClick(this.goOnWithscrollPosition)}}> ▶ </button>
    <div className="scroll-content">
    
      {this.state.points.map((point, index) => (
        <div
          key={index}
          className='scroll-date'
          style={{
            left: `${point}px`,
            color: index == this.state.scrollPosition ? 'red' : 'black', // Highlight current scroll point
          }}
          onClick={ () => {this.onPointClick(point)}}
        >{this.state.dates[index]}</div>
      ))}
  </div>
  <div></div>
  </center>)
  }

  getCircles(){

    let text_style = {
      color : 'rgba(0,0,0,1)',
      font : 'Arial',
      fontSize:'80%',
      paddingLeft:'20%;'
    }
    let text_style2 = {
      color : 'rgba(0,0,0,1)',
      font : 'Arial',
      fontSize:'80%',
      width:"90%"
    }

    let multiplier_circle = this.state.multiplier_circle*2;

    return(<div className = 'box2-circle' >
    <center className="subcircles">
      <div className="circle" style={
                          { width: (multiplier_circle*this.state.circles_radius[0]).toString()+"px",
                            height: (multiplier_circle*this.state.circles_radius[0]).toString()+"px", 
                            marginTop: ((this.state.multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1]-this.state.multiplier_circle*this.state.circles_radius[0])/2).toString()+"px" 
                          }
            }>
      </div>
      <div style={text_style}>
      {"≤ "} 
        <input id = "0" style={{textAlign: "center",width:"80%",background:"transparent",border: "none", outline: "none"}} onChange={this.handleInputChange} placeholder={this.state.sizes[0]} value={this.state.sizes[0]} ></input>
      </div>
      {/*<div style={text_style}>
        {this.state.axis_names[this.state.radius]}
      </div>*/}
    </center>

    <center className="subcircles">
      <div className="circle" style={
                          { width: (multiplier_circle*this.state.circles_radius[1]).toString()+"px",
                            height: (multiplier_circle*this.state.circles_radius[1]).toString()+"px",
                            marginTop: ((this.state.multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1]-this.state.multiplier_circle*this.state.circles_radius[1])/2).toString()+"px" 
                          }
                  }>
      </div>
      <div style={text_style}>
      {"≤ "} 
        <input id = "1" style={{textAlign: "center",width:"80%",background:"transparent",border: "none", outline: "none"}} onChange={this.handleInputChange} placeholder={this.state.sizes[1]} value={this.state.sizes[1]}></input>
      </div>
      {/*<div style={text_style}>
        {this.state.axis_names[this.state.radius]}
      </div>*/}
    </center>
    <center>
      <div className="circle" style={
                        { width: (multiplier_circle*this.state.circles_radius[2]).toString()+"px",
                          height: (multiplier_circle*this.state.circles_radius[2]).toString()+"px",
                          marginTop: ((this.state.multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1]-this.state.multiplier_circle*this.state.circles_radius[2])/2).toString()+"px" 
                        }
                    }>
      </div>
      <div style={text_style}>
        {"≤ "} 
        <input id = "2" style={{textAlign: "center", width:"80%",background:"transparent",border: "none", outline: "none"}} onChange={this.handleInputChange} placeholder={this.state.sizes[2]} value={this.state.sizes[2]}></input>
      </div>
      {/*<div style={text_style}>
        {this.state.axis_names[this.state.radius]}
      </div>*/}
    </center>
    <center>
      <div className="circle" style={
                        { width: (multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1]).toString()+"px",
                          height: (multiplier_circle*this.state.circles_radius[this.state.circles_radius.length-1]).toString()+"px" 
                        }
                    }>
      </div>
      <span>{">"}</span>
      <span style={text_style}>
        {this.state.sizes[2]}
      </span>
      {/*<div style={text_style}>
        {this.state.axis_names[this.state.radius]}
      </div>*/}
    </center>
    </div>)
  }


  // Handle mouse down to start selection
  handleMouseDown = (event) => {
    let { offsetX, offsetY } = event.nativeEvent;

    this.setState({
      selection: {
        xStart: offsetX,
        yStart: offsetY,
        xEnd: offsetX,
        yEnd: offsetY,
      },
    });
  };

  // Handle mouse move while selecting
  handleMouseMove = (event) => {
    if (!this.state.selection) return;
    const { selection } = this.state.selection;

    const { offsetX, offsetY } = event.nativeEvent;

    // Update the selection area dynamically
    this.setState((prevState) => ({
      selection: {
        ...prevState.selection,
        xEnd: offsetX,
        yEnd: offsetY,
      },
    }));
  };

  // Handle mouse up (selection end)
  handleMouseUp = () => {
    const chart = this.chartRef.current;
    if (!this.state.selection) return;
    if (this.state.selection) {
      // Calculate selected points inside the selection area
      const selectedPoints = this.getPointsInSelectionArea(chart, this.state.selection);

      // Call the callback or log the selected points
        this.state.parentCallback(selectedPoints)

      // Reset the selection area
      this.setState({ selection: null });
    }
  };

  // Function to get points inside the selection area
  getPointsInSelectionArea = (chart, selection) => {
    const { xStart, yStart, xEnd, yEnd } = selection;
    const pointsInSelection = [];
    // Check if the data points fall inside the selection rectangle
    chart.$datalabels._datasets.forEach((dataset) => {
      dataset.forEach((point, index) => {
        const meta = point._el;
        const x = meta.x;
        const y = meta.y;
        
        // Check if point lies within the selection area
        if (
          x >= Math.min(xStart, xEnd) && x <= Math.max(xStart, xEnd) &&
          y >= Math.min(yStart, yEnd) && y <= Math.max(yStart, yEnd)
        ) {
          pointsInSelection.push(point);
        }
      });
    });

    return pointsInSelection;
  };

  // Function to draw the selection area rectangle
  drawSelection = (ctx) => {
    const { selection } = this.state;

    if (!selection) return;

    const { xStart, yStart, xEnd, yEnd } = selection;

    ctx.strokeStyle = 'rgba(0, 123, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.strokeRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
    ctx.setLineDash([]); // Reset line dash
  };



  render() {
    // DATE BEHIND
    const plugins = {
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
  
        // Draw the background text
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.textAlign = 'center';
        ctx.font = '200px Arial';
        ctx.fillText(this.state.date, width / 2, height / 2);
  
        // Draw the selection rectangle (if any)
        this.drawSelection(ctx);
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
    };
  
    let data_tot = this.getDataset();
    // SET THE DATA FOR THE BUBBLE CHART
    const data = {
      datasets: data_tot[1].map((dataset) => ({
        ...dataset,
        label: dataset.label || 'Dataset Label',  // Ensure each dataset has a label
        pointStyle: 'circle',                     // Make sure the point style is a circle in the legend
        backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.6)', // Set a background color for visibility in the legend
        borderColor: (context) => {
          // Conditional borderColor based on data point properties
          const { dataIndex, dataset } = context;
          const dataPoint = dataset.data[dataIndex];
          if(!dataPoint) return 'transparent';
          return dataPoint.borderColor || 'transparent'; // Default to transparent if no borderColor is specified
        },
        borderWidth: (context) => {
          // Conditional borderWidth based on data point properties
          const { dataIndex, dataset } = context;
          const dataPoint = dataset.data[dataIndex];
          if(!dataPoint) return 0;
          return dataPoint.borderWidth || 0; // Default to 0 if no borderWidth is specified
        },
      })),
    };

  
    // OPTIONS
    const options = {
      plugins: {
        legend: {
          display: true,  // Display the legend
          labels: {
            usePointStyle: true,  // Use the point style (circle) for legend markers
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
      },
      scales: {
        x: {
          title: {
            display: true,
            text: this.state.axis_names[this.state.xAxis],
          },
        },
        y: {
          title: {
            display: true,
            text: this.state.axis_names[this.state.yAxis],
          },
          beginAtZero: true, // Ensure Y-axis starts at 0
        },
      },
    };
  
    return (
      <div >
        {this.getInputAxis()}
        <div className = "container-circle">
        <div className = 'box1-circle' onMouseDown={this.handleMouseDown}
      onMouseMove={this.handleMouseMove}
      onMouseUp={this.handleMouseUp}><Bubble options={options} data={data} plugins={[plugins]} ref={this.chartRef} />
      
      </div>
        {this.getCircles()}
        </div>
        {this.getTimeline()}
      </div>
    );
  }
}