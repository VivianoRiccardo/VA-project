// src/components/ScatterPlotMDS.js

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { computeMDS } from '../utils/mds';


const ScatterPlotMDS = ({ data }) => {
    const [mdsData, setMDSData] = useState([]);

    useEffect(() => {
        const result = computeMDS(data);
        setMDSData(result);
    }, [data]);

    const trace = {
        x: mdsData.map((d) => d[0]),
        y: mdsData.map((d) => d[1]),
        mode: 'markers',
        type: 'scatter',
        marker: { size: 8 },
    };

    return (
        <Plot
            data={[trace]}
            layout={{ title: 'MDS Scatter Plot', xaxis: { title: 'X' }, yaxis: { title: 'Y' } }}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default ScatterPlotMDS;
