import React from 'react';
import Plot from 'react-plotly.js';

type ChartType = 'pie'; // Add more chart types as needed

type ChartRenderer = {
  [key in ChartType]: (trueData: number, falseData: number) => JSX.Element;
};

const renderChart: ChartRenderer = {
  pie: (trueData, falseData) => {
    const pieData = [
      {
        values: [trueData, falseData],
        labels: ['True', 'False'],
        type: 'pie' as const,
      },
    ];
    const pieLayout = {
      height: 400,
      width: 500,
    };
    return <Plot data={pieData} layout={pieLayout} />;
  },
};
export default renderChart;
