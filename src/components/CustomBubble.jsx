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
        zoom:false,
        sorted_data : l[0],
        radius: 'pl_massj',
        xAxis: 'pl_radj',
        yAxis : 'st_dist',
        axis_names: {'pl_massj': "MASS (J)", "pl_radj": "RADIUS (J)", "st_dist":"EARTH DISTANCE (Parsec)", 'number_of_planets':'N. PLANETS-SOLAR SYSTEM',"ua": "STAR DISTANCE (UA)"},
        reverse_axis_names: {"MASS (J)":'pl_massj', "RADIUS (J)":"pl_radj", "EARTH DISTANCE (Parsec)":"st_dist", 'N. PLANETS-SOLAR SYSTEM':'number_of_planets', "STAR DISTANCE (UA)":"ua"},
        different_planets : l[1].length,
        colors : ["rgba(152,78,163,0.2)","rgba(0,150,150,0.2)", "rgba(255,127,0,0.2)", "rgba(77,175,74,0.2)", 'rgba(0,128,0,0.5)'],
        labels : l[1],
        temp_planet_type_labels:l[1],
        temp_disc_method_labels:l[3],
        temp_stellar_type_labels:l[4],
        temp_planet_type_colors:["rgba(152,78,163,0.2)","rgba(0,150,150,0.2)", "rgba(255,127,0,0.2)", "rgba(77,175,74,0.2)", 'rgba(0,128,0,0.5)'],


        temp_disc_method_colors:["rgba(0,150,150,0.2)","rgba(55,126,184,0.2)","rgba(77,175,74,0.2)","rgba(152,78,163,0.2)","rgba(255,127,0,0.2)",
                                "rgba(255,255,51,0.2)","rgba(153,213,148,0.2)","rgba(153,153,153,0.2)","rgba(204,153,255,0.2)"],


        temp_stellar_type_colors:["rgba(255,255,204,0.2)","rgba(255,237,160,0.2)","rgba(254,217,118,0.2)","rgba(254,178,76,0.2)","rgba(253,141,60,0.2)",
                                  "rgba(252,78,42,0.2)","rgba(227,26,28,0.2)","rgba(189,0,38,0.2)","rgba(128,0,38,0.2)"],
        date:2011,
        selectedType:"planet_type",
        dates : l[2],
        sizes : [0.1,1,10,20],
        sizes_dict : {"pl_massj":[0.1,1,10,20],"pl_radj":[0.01,2,3,10],"st_dist":[5000,10000,20000,300000], "number_of_planets":[2,4,6,8], "ua":[200,400,600,700]},
        circles_radius : [3.175, 3.175+5.575, 3.175+5.575+5.575, 3.175+5.575+5.575+5.575],
        multiplier_circle:1.15,
        select1Value: 'RADIUS (J)',
        select2Value: 'EARTH DISTANCE (Parsec)',
        select3Value: 'MASS (J)',
        xselect1: ['RADIUS (J)', 'EARTH DISTANCE (Parsec)','MASS (J)', 'N. PLANETS-SOLAR SYSTEM', "STAR DISTANCE (UA)"],
        yselect1: ['EARTH DISTANCE (Parsec)', 'RADIUS (J)', 'MASS (J)','N. PLANETS-SOLAR SYSTEM', "STAR DISTANCE (UA)"],
        radiusselect1: ['MASS (J)','EARTH DISTANCE (Parsec)', 'RADIUS (J)','N. PLANETS-SOLAR SYSTEM', "STAR DISTANCE (UA)"],
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
      this.handleZoom = this.handleZoom.bind(this);
      this.sortWithPriority = this.sortWithPriority.bind(this);

    }

  handleZoom(){
    let zoom = this.state.zoom;
    this.setState({zoom:!zoom})
  }

  // Custom comparator function
  sortWithPriority(strings, priorityOrder) {
    // Custom comparator function
    return strings.sort((a, b) => {
        const indexA = priorityOrder.indexOf(a);
        const indexB = priorityOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) {
            // Both a and b are in the priority list
            return indexA - indexB;
        } else if (indexA !== -1) {
            // Only a is in the priority list
            return -1;
        } else if (indexB !== -1) {
            // Only b is in the priority list
            return 1;
        } else {
            // Neither are in the priority list, fallback to alphabetical sort
            return a.localeCompare(b);
        }
    });
}

  turnDataToMenagableData(statedata){
    let stateDate = [];
    let stateLabels = [];
    let stateLabels2 = [];
    let stateLabels3 = [];
    let keys = Object.keys(statedata).sort();
    for(let i = 0; i < keys.length; i++){
      if(!stateDate.includes(parseInt(statedata[keys[i]]['discovery_date'])))
        stateDate.push(parseInt(statedata[keys[i]]['discovery_date']))
      if(!stateLabels.includes(statedata[keys[i]]['planet_type']))
        stateLabels.push(statedata[keys[i]]['planet_type'])
      if(!stateLabels2.includes(statedata[keys[i]]['pl_discmethod']))
        stateLabels2.push(statedata[keys[i]]['pl_discmethod'])
      let stellar_type = statedata[keys[i]]['stellar_type']
      if(stellar_type == "Y"){
        stellar_type = "(Y) 80–500 K"
      }
      if(stellar_type == "T"){
        stellar_type = "(T) 500–1,500 K"
      }
      if(stellar_type == "M"){
        stellar_type = "(M) 2,400–3,700 K"
      }
      if(stellar_type == "K"){
        stellar_type = "(K) 3,700–5,200 K"
      }
      if(stellar_type == "G"){
        stellar_type = "(G) 5,200–6,000 K"
      }
      if(stellar_type == "F"){
        stellar_type = "(F) 6,000–7,500 K"
      }
      if(stellar_type == "A"){
        stellar_type = "(A) 7,500–10,000 K"
      }
      if(stellar_type == "B"){
        stellar_type = "(B) 10,000–30,000 K"
      }
      if(stellar_type == "O"){
        stellar_type = "(O) 30,000–50,000 K"
      }
      if(!stateLabels3.includes(stellar_type))
        stateLabels3.push(stellar_type)
    }
    stateDate.sort();
    let data = [];
    for(let i = 0; i < stateDate.length+1; i++){
      data.push([])
    }
    for(let i = 0; i < keys.length; i++){
      let index = stateDate.indexOf(parseInt(statedata[keys[i]]['discovery_date']))
      let m = JSON.parse(JSON.stringify(statedata[keys[i]]));
      
      let stellar_type = m['stellar_type']
      if(stellar_type == "Y"){
        stellar_type = "(Y) 80–500 K"
      }
      if(stellar_type == "T"){
        stellar_type = "(T) 500–1,500 K"
      }
      if(stellar_type == "M"){
        stellar_type = "(M) 2,400–3,700 K"
      }
      if(stellar_type == "K"){
        stellar_type = "(K) 3,700–5,200 K"
      }
      if(stellar_type == "G"){
        stellar_type = "(G) 5,200–6,000 K"
      }
      if(stellar_type == "F"){
        stellar_type = "(F) 6,000–7,500 K"
      }
      if(stellar_type == "A"){
        stellar_type = "(A) 7,500–10,000 K"
      }
      if(stellar_type == "B"){
        stellar_type = "(B) 10,000–30,000 K"
      }
      if(stellar_type == "O"){
        stellar_type = "(O) 30,000–50,000 K"
      }
      m['stellar_type'] = stellar_type
      data[index].push(m);
      data[stateDate.length].push(m);
      


    }

    stateDate.push("'11-'24")


    let priorityOrder1 = ["Gas Giant", "Neptune-like", "Super Earth", "Terrestrial"];
    let priorityOrder2 = ["Transit","Radial Velocity", "Transit Timing Variations", "Microlensing", "Imaging", "Eclipse Timing Variations", "Pulsar Timing", "Pulsation Timing Variations", "Disk Kinematics", "Orbital Brightness Modulation", "Astrometry"];
    let priorityOrder3 = ["(Y) 80–500 K", "(T) 500–1,500 K", "(M) 2,400–3,700 K","(K) 3,700–5,200 K","(G) 5,200–6,000 K","(F) 6,000–7,500 K","(A) 7,500–10,000 K", "(B) 10,000–30,000 K", "(O) 30,000–50,000 K"];
    stateLabels = this.sortWithPriority(stateLabels, priorityOrder1)
    this.sortWithPriority(stateLabels2, priorityOrder2)
    this.sortWithPriority(stateLabels3, priorityOrder3)
    return [data,stateLabels,stateDate, stateLabels2, stateLabels3];
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
          let maximum_x = -9999999
          let minimum_x = 999999999
          let maximum_y = -9999999
          let minimum_y = 999999999

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
            for(let j = 0; j < this.state.dates.length; j++){
              for(let i = 0; i < this.state.sorted_data[j].length; i++){

                if (this.state.sorted_data[j][i][this.state.xAxis] > maximum_x)
                  maximum_x = this.state.sorted_data[j][i][this.state.xAxis]
                if (this.state.sorted_data[j][i][this.state.xAxis] < minimum_x)
                  minimum_x = this.state.sorted_data[j][i][this.state.xAxis]
                
                if (this.state.sorted_data[j][i][this.state.yAxis] > maximum_y)
                  maximum_y = this.state.sorted_data[j][i][this.state.yAxis]
                if (this.state.sorted_data[j][i][this.state.yAxis] < minimum_y)
                  minimum_y = this.state.sorted_data[j][i][this.state.yAxis]
              }

              
  
            }

            for(let i = 0; i < this.state.sorted_data[this.state.dates.indexOf(this.state.date)].length; i++){
              if( this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.selectedType] == this.state.labels[j]){
                

                customLabels.push(this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]['display_name'])
                if(this.state.dataFilters[this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"]]){
                    data1.push({borderColor: 'red',    // Red border for this point
                    borderWidth: 1, 
                    name: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"],
                     x: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.xAxis],
                     y: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.yAxis],
                     r: l_radius[count], 
                     z:10})
                }
                else{
                  data1.push({ borderWidth: 0, borderColor: 'red',    // Red border for this point
                    name: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i]["display_name"],
                     x: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.xAxis],
                     y: this.state.sorted_data[this.state.dates.indexOf(this.state.date)][i][this.state.yAxis],
                     r: l_radius[count], 
                    z:1})
                }
                count++;
              }
            }
            data1.sort((a, b) => a.z - b.z);
            let dict = {label:this.state.labels[j],backgroundColor: this.state.colors[j],datalabels: {
              display: false // This disables displaying values near data points
            },data : data1};
            data_tot.push(dict);
          }
          return [customLabels,data_tot, maximum_x+maximum_x*0.1, minimum_x, maximum_y+maximum_y*0.1, minimum_y]
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
    if(e.target.value == "pl_discmethod"){
      this.setState({different_planets:this.state.temp_disc_method_labels.length, labels:this.state.temp_disc_method_labels,colors:this.state.temp_disc_method_colors,selectedType:e.target.value},() =>{
})}
    else if(e.target.value == "stellar_type")
    this.setState({different_planets:this.state.temp_stellar_type_labels.length,labels:this.state.temp_stellar_type_labels,colors:this.state.temp_stellar_type_colors,selectedType:e.target.value})

    else
    this.setState({different_planets:this.state.temp_planet_type_labels.length,labels:this.state.temp_planet_type_labels,colors:this.state.temp_planet_type_colors,selectedType:e.target.value})
  };


  getInputAxis(){
    let button_style = {
      "margin-left":"5%"
    }

    return(<><div style={{ display: "flex", justifyContent: "space-between" }} ><center className="circle-container">
      <div>
        <label style={{'color':'grey'}}>X</label>
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
        <label style={{'color':'grey'}}>Y</label>
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
        <label style={{'color':'grey'}}>Size</label>
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
              <option value={"stellar_type"}>Star Type</option>
            </select>
          </div>
    </div>
    <div>
    <button onClick={this.handleZoom}>{this.state.zoom?"Disable zoom":"Enable zoom"}</button>
  </div></>)
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
            color: index == this.state.scrollPosition ? 'red' : 'grey', // Highlight current scroll point
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
      color : 'grey',
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
        <input id = "0" style={{textAlign: "center",width:"80%",background:"transparent",border: "none", outline: "none", color:"grey"}} onChange={this.handleInputChange} placeholder={this.state.sizes[0]} value={this.state.sizes[0]} ></input>
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
        <input id = "1" style={{textAlign: "center",width:"80%",background:"transparent",border: "none", outline: "none", color:"grey"}} onChange={this.handleInputChange} placeholder={this.state.sizes[1]} value={this.state.sizes[1]}></input>
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
        <input id = "2" style={{textAlign: "center", width:"80%",background:"transparent",border: "none", outline: "none", color:"grey"}} onChange={this.handleInputChange} placeholder={this.state.sizes[2]} value={this.state.sizes[2]}></input>
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
      <span style={text_style}>{">"}</span>
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
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.textAlign = 'center';
        ctx.font = '130px Arial';
        ctx.fillText(this.state.date, width / 2, height / 2);
  
        // Draw the selection rectangle (if any)
        this.drawSelection(ctx);
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: this.state.zoom // SET SCROOL ZOOM TO TRUE
          },
          mode: "xy",
          speed: 100
        },
        pan: {
          enabled: this.state.zoom,
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
              enabled: this.state.zoom // SET SCROOL ZOOM TO TRUE
            },
            mode: "xy",
            speed: 100
          },
          pan: {
            enabled: this.state.zoom,
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
          max:data_tot[2]
        },
        y: {
          title: {
            display: true,
            text: this.state.axis_names[this.state.yAxis],
          },
          beginAtZero: true, // Ensure Y-axis starts at 0
          max:data_tot[4]
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
