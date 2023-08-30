import React from 'react';
import Plot from 'react-plotly.js';

interface ChartRendererClass {
  getChart: (data: any) => JSX.Element,
  getCummulativeResult<T>(data: T): T,
}

export class PieChart implements ChartRendererClass {
  constructor() { }

  getChart(data: any) {
    const trueData = data.true;
    const falseData = data.false;
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
  }

  getCummulativeResult(data: any) {
    return data.reduce((acc: any, { data }: { data: any }) => {
      const { resultObject } = data;
      acc.true += resultObject.true;
      acc.false += resultObject.false;
      return acc;
    }, { true: 0, false: 0 });
  }
}