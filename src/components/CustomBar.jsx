import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  zoomPlugin
);

export class CustomBar extends React.Component{

  constructor(props){
    super(props);

    let l = this.turnDataToMenagableData(props.data);

    this.state = {
      data : JSON.parse(JSON.stringify(props.data)),
      zoom:false,
      select1Value: 'RADIUS (J)',
      select2Value: 'AMOUNT',
      reverse_axis_names: {"N. PLANETS-SOLAR SYSTEM":"number_of_planets","STAR DISTANCE (AU)":"ua","DATE":"discovery_date","MASS (J)":'pl_massj', "RADIUS (J)":"pl_radj", "EARTH DISTANCE (Parsec)":"st_dist", "AMOUNT":"amount", "PERCENTAGE":"percentage"},
      xAxis: 'pl_radj',
      yAxis : 'amount',
      xselect1: ['RADIUS (J)', 'EARTH DISTANCE (Parsec)','MASS (J)', 'DATE',"N. PLANETS-SOLAR SYSTEM","STAR DISTANCE (AU)"],
      yselect1: ['AMOUNT', 'PERCENTAGE'],
      selectedType:"planet_type",
      sorted_data : l[0],
      different_planets : l[1].length,
      dates : l[2],
      labels:l[1],
      colors:["rgba(152,78,163,0.7)","rgba(0,150,150,0.7)", "rgba(255,127,0,0.7)", "rgba(77,175,74,0.7)", 'rgba(0,128,0,0.5)'],
      temp_planet_type_labels:l[1],
      temp_disc_method_labels:l[3],
      temp_star_type_labels:l[4],
      temp_planet_type_colors:["rgba(152,78,163,0.7)","rgba(0,150,150,0.7)", "rgba(255,127,0,0.7)", "rgba(77,175,74,0.7)", 'rgba(0,128,0,0.5)'],


        temp_disc_method_colors:["rgba(0,150,150,0.7)","rgba(55,126,184,0.7)","rgba(77,175,74,0.7)","rgba(152,78,163,0.7)","rgba(255,127,0,0.7)",
                                "rgba(255,255,51,0.7)","rgba(153,213,148,0.7)","rgba(153,153,153,0.7)","rgba(204,153,255,0.7)"],


        temp_stellar_type_colors:["rgba(255,255,204,0.7)","rgba(255,237,160,0.7)","rgba(254,217,118,0.7)","rgba(254,178,76,0.7)","rgba(253,141,60,0.7)",
                                  "rgba(252,78,42,0.7)","rgba(227,26,28,0.7)","rgba(189,0,38,0.7)","rgba(128,0,38,0.7)"],
    }

    
    this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
    this.getData = this.getData.bind(this);
    this.chartRef = React.createRef();
    this.handleZoom = this.handleZoom.bind(this);
    this.sortWithPriority = this.sortWithPriority.bind(this);

  }

  handleZoom(){
    let zoom = this.state.zoom;
    this.setState({zoom:!zoom})
  }
  turnDataToMenagableData(statedata){
    for(let key in statedata){
      let stellar_type = statedata[key]['stellar_type']
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
      statedata[key]['stellar_type'] = stellar_type;
    }
    let stateDate = [];
    let stateStDistance = [];
    let stateRdaj = [];
    let stateNPlanets = [];
    let stateMassj = [];
    let stateUa = [];
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
      if(!stateMassj.includes(parseFloat(statedata[keys[i]]['pl_massj'])))
        stateMassj.push(parseFloat(statedata[keys[i]]['pl_massj']))
      if(!stateUa.includes(parseFloat(statedata[keys[i]]['ua'])))
        stateUa.push(parseFloat(statedata[keys[i]]['ua']))
      if(!stateNPlanets.includes(parseFloat(statedata[keys[i]]['number_of_planets'])))
        stateNPlanets.push(parseFloat(statedata[keys[i]]['number_of_planets']))
      if(!stateRdaj.includes(parseFloat(statedata[keys[i]]['pl_radj'])))
        stateRdaj.push(parseFloat(statedata[keys[i]]['pl_radj']))
      if(!stateStDistance.includes(parseFloat(statedata[keys[i]]['st_dist'])))
        stateStDistance.push(parseFloat(statedata[keys[i]]['st_dist']))
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
    stateMassj.sort((a, b) => a - b);;
    stateRdaj.sort((a, b) => a - b);;
    stateStDistance.sort((a, b) => a - b);;
    stateNPlanets.sort((a, b) => a - b);;
    stateUa.sort((a, b) => a - b);;
    let splitter = 9;


    let data = {};
    let sortedData = []
    for(let i = 0; i < stateDate.length; i++){
      data[stateDate[i]] = []
      sortedData.push(stateDate[i])
    }
    for(let i = 0; i < keys.length; i++){
      data[parseInt(statedata[keys[i]]['discovery_date'])].push(statedata[keys[i]])
    }


    let dataMassj = {}
    let sortedDataMassj = []
    let n = parseInt(stateMassj.length/splitter);
    for(let i = 0; i <  stateMassj.length; i+=n){
      let min = i+n-1;
      if(min > stateMassj.length)
        min = stateMassj.length-1;
      sortedDataMassj.push(stateMassj[i].toFixed(2).toString()+'-'+stateMassj[min].toFixed(2).toString())
      dataMassj[stateMassj[i].toFixed(2).toString()+'-'+stateMassj[min].toFixed(2).toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['pl_massj']) >= stateMassj[i] && parseFloat(statedata[keys[k]]['pl_massj']) < stateMassj[min]){
          dataMassj[stateMassj[i].toFixed(2).toString()+'-'+stateMassj[min].toFixed(2).toString()].push(statedata[keys[k]])
        }
      }
    }

    let dataUa = {}
    let sortedDataUa = []
    n = parseInt(stateUa.length/splitter);
    for(let i = 0; i <  stateUa.length; i+=n){
      let min = i+n-1;
      if(min > stateUa.length)
        min = stateUa.length-1;
      sortedDataUa.push(stateUa[i].toFixed(2).toString()+'-'+stateUa[min].toFixed(2).toString())
      dataUa[stateUa[i].toFixed(2).toString()+'-'+stateUa[min].toFixed(2).toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['ua']) >= stateUa[i] && parseFloat(statedata[keys[k]]['ua']) < stateUa[min]){
          dataUa[stateUa[i].toFixed(2).toString()+'-'+stateUa[min].toFixed(2).toString()].push(statedata[keys[k]])
        }
      }
    }

    let dataNplanets = {}
    let sortedNplanets = []
    n = (1);
    for(let i = 0; i <  stateNPlanets.length; i+=n){
      sortedNplanets.push(stateNPlanets[i].toString())
      dataNplanets[stateNPlanets[i].toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(statedata[keys[k]]['number_of_planets'] === stateNPlanets[i]){
          dataNplanets[stateNPlanets[i].toString()].push(statedata[keys[k]])
        }
      }
    }

    let dataRdaj = {}
    let sortedDataRdaj = []
    n = parseInt(stateRdaj.length/splitter);
    for(let i = 0; i <  stateRdaj.length; i+=n){
      let min = i+n-1;
      if(min > stateRdaj.length)
        min = stateRdaj.length-1;
      sortedDataRdaj.push(stateRdaj[i].toFixed(2).toString()+'-'+stateRdaj[min].toFixed(2).toString())
      dataRdaj[stateRdaj[i].toFixed(2).toString()+'-'+stateRdaj[min].toFixed(2).toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['pl_radj']) >= stateRdaj[i] && parseFloat(statedata[keys[k]]['pl_radj']) < stateRdaj[min]){
          dataRdaj[stateRdaj[i].toFixed(2).toString()+'-'+stateRdaj[min].toFixed(2).toString()].push(statedata[keys[k]])
        }
      }
    }

    let dataStDistance = {}
    let sortedDataStDistance = []
    n = parseInt(stateStDistance.length/splitter);
    for(let i = 0; i <  stateStDistance.length; i+=n){
      let min = i+n-1;
      if(min > stateStDistance.length)
        min = stateStDistance.length-1;
        sortedDataStDistance.push(stateStDistance[i].toFixed(2).toString()+'-'+stateStDistance[min].toFixed(2).toString())

        dataStDistance[stateStDistance[i].toFixed(2).toString()+'-'+stateStDistance[min].toFixed(2).toString()] = [];
      for(let k = 0; k < keys.length; k++){

          if(parseFloat(statedata[keys[k]]['st_dist']) >= stateStDistance[i] && parseFloat(statedata[keys[k]]['st_dist']) < stateStDistance[min]){
            dataStDistance[stateStDistance[i].toFixed(2).toString()+'-'+stateStDistance[min].toFixed(2).toString()].push(statedata[keys[k]])
          }
      }
    }

    let ret = {
      'discovery_date':{
        'sorted_key':sortedData,
        'dict':data
      },
      'pl_massj':{
        'sorted_key':sortedDataMassj,
        'dict':dataMassj
      },
      'pl_radj':{
        'sorted_key':sortedDataRdaj,
        'dict':dataRdaj
      },
      'st_dist':{
        'sorted_key':sortedDataStDistance,
        'dict':dataStDistance
      },
      'number_of_planets':{
        'sorted_key':sortedNplanets,
        'dict':dataNplanets
      },
      'ua':{
        'sorted_key':sortedDataUa,
        'dict':dataUa
      }
    }

    let priorityOrder1 = ["Gas Giant", "Neptune-like", "Super Earth", "Terrestrial"];
    let priorityOrder2 = ["Transit","Radial Velocity", "Transit Timing Variations", "Microlensing", "Imaging", "Eclipse Timing Variations", "Pulsar Timing", "Pulsation Timing Variations", "Disk Kinematics", "Orbital Brightness Modulation", "Astrometry"];
    let priorityOrder3 = ["(Y) 80–500 K", "(T) 500–1,500 K", "(M) 2,400–3,700 K","(K) 3,700–5,200 K","(G) 5,200–6,000 K","(F) 6,000–7,500 K","(A) 7,500–10,000 K", "(B) 10,000–30,000 K", "(O) 30,000–50,000 K"];
    stateLabels = this.sortWithPriority(stateLabels, priorityOrder1)
    this.sortWithPriority(stateLabels2, priorityOrder2)
    this.sortWithPriority(stateLabels3, priorityOrder3)

    return [ret,stateLabels,stateDate, stateLabels2, stateLabels3];
  }

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

  handleSelectChange(select, value){

    if(select === 'select1'){
      this.setState({ select1Value:value,xAxis:this.state.reverse_axis_names[value]});
    }

    else{
      this.setState({ select2Value:value,yAxis:this.state.reverse_axis_names[value]});
    }

  }

  handleSelectLabelChange(e){
    if(e.target.value == "pl_discmethod")
        this.setState({different_planets:this.state.temp_disc_method_labels.length, labels:this.state.temp_disc_method_labels,colors:this.state.temp_disc_method_colors,selectedType:e.target.value},() =>{
    })
    else if(e.target.value == "stellar_type")
      this.setState({different_planets:this.state.temp_star_type_labels.length,labels:this.state.temp_star_type_labels,colors:this.state.temp_stellar_type_colors,selectedType:e.target.value})

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
        >
          {this.state.yselect1.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={this.handleZoom}>{this.state.zoom?"Disable zoom":"Enable zoom"}</button>
      </div>
    </center>
          <div>
            <select onChange={this.handleSelectLabelChange} value={this.state.selectedType}>
              <option value={"planet_type"}>Planet Type</option>
              <option value={"pl_discmethod"}>Planet Discmethod</option>
              <option value={"stellar_type"}>Star Type</option>
            </select>
          </div>
    </div>)
  }



  getData() {
    let label = this.state.sorted_data[this.state.xAxis]['sorted_key'];
    let d = this.state.sorted_data[this.state.xAxis]['dict'];
    let datasets = [];
    
    for (let j = 0; j < this.state.labels.length; j++) {
      let l = [];
      for (let i = 0; i < label.length; i++) {
        l.push(0);
      }
  
      let dictData = {
        label: this.state.labels[j],
        data: l,
        backgroundColor: this.state.colors[j],
        borderColor: this.state.colors[j],
        borderWidth: 1,
      };
  
      for (let i = 0; i < label.length; i++) {
        for (let k = 0; k < d[label[i]].length; k++) {
          if (d[label[i]][k][this.state.selectedType] === this.state.labels[j]) {
            dictData.data[i] += 1;
          }
        }
      }
      for (let i = 0; i < label.length; i++) {
        if(dictData.data[i] == 0){
          dictData.data[i] = null;
        }
      }

      
      
  
      // Check if all data points are zero
      datasets.push(dictData);
    }


    if(this.state.select2Value === "PERCENTAGE"){
      for (let i = 0; i < label.length; i++) {
        let n = 0;
        for(let j = 0; j < datasets.length; j++){
          if(datasets[j].data[i] != null){
            n+=datasets[j].data[i];
          }
        }
        let summation = 0;
        for(let j = 0; j < datasets.length; j++){
          if(datasets[j].data[i] != null){
            datasets[j].data[i]=(parseFloat(datasets[j].data[i])/parseFloat(n)).toFixed(3);
            summation+=datasets[j].data[i];
          }
        }
        if(summation > 1){
          let diff = summation-1;
          let maximum_index = -1;
          let maximum_value = -1
          for(let j = 0; j < datasets.length; j++){
            if(datasets[j].data[i] != null){
              if (datasets[j].data[i] > maximum_value){
                maximum_value = datasets[j].data[i]
                maximum_index = j
              }
            }
          }
          datasets[maximum_index].data[i]-=diff;
        }

        else if(summation < 1){
          let diff = 1-summation;
          let maximum_index = -1;
          let maximum_value = 10
          for(let j = 0; j < datasets.length; j++){
            if(datasets[j].data[i] != null){
              if (datasets[j].data[i] < maximum_value){
                maximum_value = datasets[j].data[i]
                maximum_index = j
              }
            }
          }
          datasets[maximum_index].data[i]+=diff;
        }


      }
      
    }

  
    return { labels: label, datasets: datasets };
  }


  render(){


    const data = this.getData();
    
    const options = {
      responsive: true,
      plugins: {
          legend: {
            display: true,  // Display the legend
            labels: {
              usePointStyle: true,  // Use the point style (circle) for legend markers
            },
          },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
            },
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
          stacked: true,
          title: {
            display: true,
            text: this.state.select1Value
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: this.state.select2Value
          }
        },
      },
    };



    return (
      <div>
        {this.getInputAxis()}
        <Bar ref={this.chartRef} data={data} options={options} />
      </div>
    );
  }
};
