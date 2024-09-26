'use client';

import {
  Chart,
  ColumnSeries,
  Category,
  Legend,
  Tooltip,
  DataLabel,
} from '@syncfusion/ej2-charts';
import { useEffect, useRef } from 'react';

Chart.Inject(ColumnSeries, Category, Legend, Tooltip, DataLabel);

export default function Graph() {
  const chartRef = useRef<Chart | null>(null); // Create a ref to hold the chart instance

  useEffect(() => {
    // Create and mount the chart when the component mounts
    chartRef.current = new Chart({
      title: 'Chart',
      series: [
        {
          dataSource: [
            { country: 'USA', sales: 2500 },
            { country: 'China', sales: 2300 },
            { country: 'India', sales: 2000 },
            { country: 'Japan', sales: 1800 },
          ],
          type: 'Column',
          xName: 'country',
          yName: 'sales',
          name: 'Sales',
          marker: {
            dataLabel: {
              visible: true,
            },
          },
        },
      ],
      primaryXAxis: { valueType: 'Category', title: 'Country' },
      primaryYAxis: { title: 'Sales (in million USD)' },
      legendSettings: { visible: true },
      tooltip: { enable: true },
    });

    chartRef.current.appendTo('#chartContainer');

    // Clean up the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the chart instance
      }
    };
  }, []);

  return (
    <div className='flex h-screen items-center justify-center'>
      <div
        id='chartContainer'
        className='max-w-4xl rounded-lg bg-white p-4 shadow-lg'
        style={{ width: '600px', height: '400px' }}
      />
    </div>
  );
}
