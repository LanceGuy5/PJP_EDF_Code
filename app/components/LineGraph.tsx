'use client';

import { useEffect, useRef, useState } from 'react';
// import { Grapher } from '../classes/Grapher';
import ReactSwitch from 'react-switch';
import * as echarts from 'echarts';
import { ECharts } from 'echarts';
import { ERROR, LOG } from '../helpers/util';
import { Grapher } from '../classes/Grapher';
import { DataPoint } from '../classes/DataPoint';

export default function LineGraph() {
  const [isEnabled, setEnabled] = useState(false);
  const chartRef = useRef<ECharts | null>(null); // Create a ref to hold the chart instance
  const seriesRef = useRef<{ x: number; y: number }[]>([]); // Ref for persistent series data
  const grapher = new Grapher(chartRef); // Grapher that can map to a serial port

  useEffect(() => {
    // Create and mount the chart when the component mounts
    chartRef.current = echarts.init(
      document.getElementById('chartContainer') as HTMLDivElement
    );

    // Specify the configuration items and data for the chart
    const option = {
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: seriesRef.current,
          type: 'line',
          smooth: true,
        },
      ],
    };

    // Display the chart using the configuration items and data just specified.
    chartRef.current.setOption(option);

    // Clean up the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        LOG('Destroying chart...');
        chartRef.current.clear();
        chartRef.current.dispose();
      }
    };
  }, []);

  setInterval(() => {
    if (isEnabled) {
      grapher.tick();
    }
  }, 20);

  const handleTestDataClick = (grapher: Grapher) => {
    LOG('TEST DATA button clicked!');
    if (chartRef.current) {
      LOG('Chart is initialized, calling testDataLive...');
      let i = 0;
      while (i < 1000) {
        console.log('recieveData');
        grapher.recieveData(new DataPoint<number>(i, Date.now()));
        i++;
      }
    } else {
      ERROR('Chart is not initialized.');
    }
  };

  return (
    <>
      <div className='graph-element flex h-screen items-center justify-center'>
        <div
          className='relative max-w-4xl rounded-lg bg-white p-4 shadow-lg'
          style={{ width: '600px', height: '400px' }}
        >
          <ReactSwitch
            checked={isEnabled}
            onChange={setEnabled}
            onColor='#66ff66'
            offColor='#ffcccc'
          />

          {/* Top right (Close Button) */}
          <div className='absolute right-2 top-2'>
            <button
              className='text-xl font-bold text-red-600'
              onClick={() => handleTestDataClick(grapher)} // Call the wrapper function
            >
              TEST DATA
            </button>
          </div>

          {/* Chart Container */}
          <div id='chartContainer' className='h-full w-full' />
        </div>
      </div>
    </>
  );
}
