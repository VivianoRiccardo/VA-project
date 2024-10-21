import { getMatrixElements, getListNames } from "../utils/Matrix";
import React, { useEffect, useState, useRef } from "react";
import * as Hermes from "../utils/hermes";
import _ from 'lodash';


export default class CustomParallel extends React.Component{
  constructor(props){
    super(props)
      this.state = {
        data : props.data,
        ownFilteredData: {},
        dataList:{},
        dataFilters:props.dataFilters,
        parentFilteredData:props.filteredData,
        parentCallback:props.callback,
        counter:props.counter,
        updated:props.updated,
        hermesRef:undefined
      }
      this.getDataFilters = this.getDataFilters.bind(this);

      
    }

    

    shouldComponentUpdate(nextProps, nextState) {
      // Deep comparison for dataFilters
      const dataFiltersChanged = !_.isEqual(nextProps.dataFilters, this.props.dataFilters);
      const dataCounterChanged = nextProps.counter != this.props.counter
      const dataupdatedChanged = nextState.updated != this.props.updated
      return (
        dataFiltersChanged || dataCounterChanged || dataupdatedChanged
      );
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
      // Only update state if props have changed
      let flag = false;
      for (let key in nextProps.dataFilters){
        if(nextProps.dataFilters[key] !== prevState.dataFilters[key]){
          flag = true;
         break;
        }
      }

      let flag2 = nextProps.counter != prevState.counter
      if(flag){
        if(flag2){
          return {dataFilters:nextProps.dataFilters, counter:nextProps.counter, updated:nextProps.updated}
        }
          return {dataFilters:nextProps.dataFilters}
        }
     
      return null;
    }
  
    getDataFilters(updated){
      let l = [false]
      if(updated != this.state.updated){
        l[0] = true 
        for(let key in this.state.dataFilters){
          if(this.state.dataFilters[key]){
            for(let i = 0; i < this.state.dataList['names'].length; i++){
              if(this.state.dataList['names'][i] == key){
                l.push(i);
              }
            }
          }
        }
      }
      return l;
    }

  componentDidUpdate(prevProps, prevState) {

 }


  componentDidMount(){
    const tester = Hermes.default.getTester();
    const dataList = getMatrixElements(this.state.data, "planet_type");
    const names = getListNames(this.state.data, "planet_type");

    const name_dim = {
      categories: names,
      dataOnEdge: false,
      key: "names",
      label: "Name",
      type: "categorical",
    };
    let types = [];
    
      const uniquePlanetTypes = new Set(
        Object.values(this.state.data).map((obj) => obj.planet_type)
      );
      types = [...uniquePlanetTypes];
    const type_dim = {
      categories: types,
      dataOnEdge: false,
      key: "planets_type",
      label: "Planet Types",
      type: "categorical",
    };

    let discovery_date_types = []
      const uniqueDiscoveryTypes = new Set(
        Object.values(this.state.data).map((obj) => obj.discovery_date)
      );
      discovery_date_types = [...uniqueDiscoveryTypes];

      let discovery_method_types = []
      const uniqueDiscoveryMethodTypes = new Set(
        Object.values(this.state.data).map((obj) => obj.pl_discmethod)
      );
      discovery_method_types = [...uniqueDiscoveryMethodTypes];
    
      let stellar_types = []
      const uniqueStellarTypes = new Set(
        Object.values(this.state.data).map((obj) => obj.stellar_type)
      );
      stellar_types = [...uniqueStellarTypes];
      stellar_types[0] = "(Y) 80–500 K"
      stellar_types[1] = "(T) 500–1,500 K"
      stellar_types[2] = "(M) 2,400–3,700 K"
      stellar_types[3] = "(K) 3,700–5,200 K"
      stellar_types[4] = "(G) 5,200–6,000 K"
      stellar_types[5] = "(F) 6,000–7,500 K"
      stellar_types[6] = "(A) 7,500–10,000 K"
      stellar_types[7] = "(B) 10,000–30,000 K"
      stellar_types[8] = "(O) 30,000–50,000 K"
    const discovery_dim = {
      categories: discovery_date_types,
      dataOnEdge: false,
      key: "discovery_date",
      label: "Date",
      type: "categorical",
    };

    const stellar_type = {
      categories: stellar_types,
      dataOnEdge: false,
      key: "stellar_type",
      label: "Star Type",
      type: "categorical",
    };

    const mass_dim = {
      dataOnEdge: false,
      key: "masses_display",
      label: "Mass (J)",
      type: "linear",
    };

    const number_of_planets = {
      dataOnEdge: false,
      key: "number_of_planets",
      label: "N. Planets-Solar System",
      type: "linear",
    };

    const own_star = {
      dataOnEdge: false,
      key: "ua",
      label: "Star Distance (AU)",
      type: "linear",
    };

    const dist_dim = {
      dataOnEdge: false,
      key: "st_distances",
      label: "Earth Distance (Parsec)",
      type: "linear",
    };

    const radj_dim = {
      dataOnEdge: false,
      key: "pl_radj",
      label: "Radius (J)         ",
      type: "linear",
    };

    const discovery_method = {
      categories: discovery_method_types,
      dataOnEdge: false,
      key: "pl_discmethod",
      label: "      Method",
      type: "categorical",
    };
    discovery_dim.categories.sort()
    const dimensions = [discovery_method,type_dim,discovery_dim,stellar_type,number_of_planets,mass_dim, dist_dim,own_star,radj_dim ];

    const options = {

      

      animation: {
        duration: 0, // Set animation duration to zero
      },
      direction: "horizontal",
      style: {
        data: {
          colorScale: {
            colors: [
              "rgba(90,174,97, 0.1)"
            ],
            dimensionKey: dimensions[dimensions.length - 1].key,
          },
          path: {
            type: "bezier",
          },
        },
        padding: [32, 16],
      },
    };

    // Ensure Hermes renders only after the DOM is ready
      new Hermes.default("#hermes", dimensions, options, dataList,this.state.parentCallback,this.getDataFilters);
      this.setState({dataList:dataList})
  }
render(){
    return (
      <div >
        <div id="hermes" ref={this.state.hermesRef} className="parallel_chart" />
      </div>
    );
  };
}

