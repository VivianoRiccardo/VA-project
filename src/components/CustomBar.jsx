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
      data : props.data,
      select1Value: 'RADIUS (J)',
      select2Value: 'AMOUNT',
      reverse_axis_names: {"DATE":"discovery_date","MASS (J)":'pl_massj', "RADIUS (J)":"pl_radj", "STAR DISTANCE (AU)":"st_dist", "AMOUNT":"amount", "PERCENTAGE":"percentage"},
      xAxis: 'pl_radj',
      yAxis : 'amount',
      xselect1: ['RADIUS (J)', 'STAR DISTANCE (AU)','MASS (J)', 'DATE'],
      yselect1: ['AMOUNT', 'PERCENTAGE'],
      selectedType:"planet_type",
      sorted_data : l[0],
      different_planets : l[1].length,
      dates : l[2],
      labels:l[1],
      colors:["rgba(123,50,148,0.7)","rgba(194,165,207,0.7)", "rgba(166,219,160,0.7)", "rgba(0,136,55,0.7)", 'rgba(0,128,0,0.5)'],
      temp_planet_type_labels:l[1],
      temp_disc_method_labels:l[3],
      temp_planet_type_colors:["rgba(123,50,148,0.7)","rgba(194,165,207,0.7)", "rgba(166,219,160,0.7)", "rgba(0,136,55,0.7)", 'rgba(0,128,0,0.5)'],
      temp_disc_method_colors:["rgba(64,0,75,0.7)","rgba(118,42,131,0.7)","rgba(153,112,171,0.7)","rgba(194,165,207,0.7)","rgba(231,212,232,0.7)",
                                "rgba(217,240,211,0.7)","rgba(166,219,160,0.7)","rgba(90,174,97,0.7)","rgba(27,120,55,0.7)","rgba(0,68,27,0.7)"],
    }

    
    this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
    this.getData = this.getData.bind(this);
    this.chartRef = React.createRef();
  }

  turnDataToMenagableData(statedata){
    let stateDate = [];
    let stateStDistance = [];
    let stateRdaj = [];
    let stateMassj = [];
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
      if(!stateMassj.includes(parseFloat(statedata[keys[i]]['pl_massj'])))
        stateMassj.push(parseFloat(statedata[keys[i]]['pl_massj']))
      if(!stateRdaj.includes(parseFloat(statedata[keys[i]]['pl_radj'])))
        stateRdaj.push(parseFloat(statedata[keys[i]]['pl_radj']))
      if(!stateStDistance.includes(parseFloat(statedata[keys[i]]['st_dist'])))
        stateStDistance.push(parseFloat(statedata[keys[i]]['st_dist']))
    }
    stateDate.sort();
    stateMassj.sort();
    stateRdaj.sort();
    stateStDistance.sort();

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
      sortedDataMassj.push(stateMassj[i].toString()+'-'+stateMassj[min].toString())
      dataMassj[stateMassj[i].toString()+'-'+stateMassj[min].toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['pl_massj']) >= stateMassj[i] && parseFloat(statedata[keys[k]]['pl_massj']) < stateMassj[min]){
          dataMassj[stateMassj[i].toString()+'-'+stateMassj[min].toString()].push(statedata[keys[k]])
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
      sortedDataRdaj.push(stateRdaj[i].toString()+'-'+stateRdaj[min].toString())
      dataRdaj[stateRdaj[i].toString()+'-'+stateRdaj[min].toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['pl_radj']) >= stateRdaj[i] && parseFloat(statedata[keys[k]]['pl_radj']) < stateRdaj[min]){
          dataRdaj[stateRdaj[i].toString()+'-'+stateRdaj[min].toString()].push(statedata[keys[k]])
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
      sortedDataStDistance.push(stateStDistance[i].toString()+'-'+stateStDistance[min].toString())
      dataStDistance[stateStDistance[i].toString()+'-'+stateStDistance[min].toString()] = [];
      for(let k = 0; k < keys.length; k++){
        if(parseFloat(statedata[keys[k]]['st_dist']) >= stateStDistance[i] && parseFloat(statedata[keys[k]]['st_dist']) < stateStDistance[min]){
          dataStDistance[stateStDistance[i].toString()+'-'+stateStDistance[min].toString()].push(statedata[keys[k]])
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
    }

    return [ret,stateLabels,stateDate, stateLabels2];
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
    </center>
          <div>
            <select onChange={this.handleSelectLabelChange} value={this.state.selectedType}>
              <option value={"planet_type"}>Planet Type</option>
              <option value={"pl_discmethod"}>Planet Discmethod</option>
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
        for(let j = 0; j < datasets.length; j++){
          if(datasets[j].data[i] != null){
            datasets[j].data[i]=(parseFloat(datasets[j].data[i])/parseFloat(n)).toFixed(2);
          }
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
