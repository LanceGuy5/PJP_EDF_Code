import { Grapher } from '@/app/classes/Grapher';
import { useEffect, useRef, useState } from 'react';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { LOG } from '@/app/helpers/util';

interface GridSpotContentProps {
  type: ECharts | null;
  name: string;
  editMode: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Act as wrapper for grid content!
 */
export default function GridSpotContentComponent({
  type,
  name,
  editMode,
  x,
  y,
  width,
  height,
}: GridSpotContentProps) {
  const [running, setRunning] = useState(false);
  const [retracted, setRetracted] = useState(false);

  const chartRef = useRef<ECharts | null>(type); // Create a ref to hold the chart instance
  const seriesRef = useRef<{ x: number; y: number }[]>([]); // Ref for persistent series data
  const grapher = new Grapher(chartRef); // Grapher that can map to a serial port

  // TODO setXXX functions are for moving/resizing
  const [trueWidth, setTrueWidth] = useState(width);
  const [trueHeight, setTrueHeight] = useState(height);
  const [trueX, setTrueX] = useState(x);
  const [trueY, setTrueY] = useState(y);

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

  return (
    <div
      style={{
        left: `${trueX}px`,
        top: `${trueY}px`,
        width: `${trueWidth}px`,
        height: `${trueHeight}px`,
        zIndex: 1000, // Ensure it's on top, you can adjust the value as needed
        transform: `translate(-50%, -50%)`, // Center the component around the (x, y) point
        backgroundColor: 'white',
        padding: '6px',
      }}
      className={!editMode ? 'grid-spot-content' : 'grid-spot-content-edit'}
    >
      <header
        className={`content-header flex flex-row items-center justify-between`}
      >
        <p className='text-black'>{name}</p>
        <button
          onClick={() => {
            setRetracted(!retracted);
          }}
        >
          <p className='text-black'>{retracted ? '▼' : '▲'}</p>
        </button>
        <button
          onClick={() => {
            setRunning(!running);
            if (running) {
              grapher.start();
            } else {
              grapher.stop();
            }
          }}
          className={`w-12 transform rounded-md ${
            !running ? 'bg-green-500' : 'bg-red-500'
          } px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105`}
        >
          {!running ? '▶' : '⏹'}
        </button>
      </header>
      <div id='chartContainer' className='h-full w-full' />
    </div>
  );
}
