import { ERROR, LOG } from '@/app/helpers/util';
import { ChartType, DataOption } from '@/app/types/ChartOptions';
import { ECBasicOption } from 'echarts/types/dist/shared';
import React, { useEffect, useState } from 'react';

interface InfoPopupProps {
  onClose: () => void;
  onConfirm: (content: ECBasicOption, port: string, name: string) => void;
}

const GridSpotPopup: React.FC<InfoPopupProps> = ({ onClose, onConfirm }) => {
  // Form state to manage user input
  const [name, setName] = useState<string>('New Chart');
  const [ports, setPorts] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [xAxisType, setXAxisType] = useState<DataOption>('category');
  const [xAxisData, setXAxisData] = useState<string>('A,B,C,D,E'); // Comma-separated values
  const [yAxisType, setYAxisType] = useState<DataOption>('value');
  const [seriesType, setSeriesType] = useState<ChartType>('rigid-line');
  const [seriesData, setSeriesData] = useState<string>('1,2,3,4,5'); // Comma-separated values

  const handleSubmit = () => {
    const xAxisArray = xAxisData.split(',').map((item) => item.trim());
    const seriesArray = seriesData
      .split(',')
      .map((item) => Number(item.trim()));

    onConfirm(
      {
        xAxis: {
          type: xAxisType,
          data: xAxisArray,
        },
        yAxis: {
          type: yAxisType,
        },
        series: [
          {
            type:
              seriesType == 'rigid-line' || seriesType == 'smooth-line'
                ? 'line'
                : 'bar',
            data: seriesArray,
            smooth: seriesType == 'smooth-line',
          },
        ],
      },
      selectedPort!,
      name
    );
  };

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).electronAPI) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result: string = await (window as any).electronAPI.listPorts();
          const ret = result.substring(0, result.length - 1).split('&');
          setPorts(ret); // Set the ports array in state
        } else {
          LOG('Electron API not available in this environment');
        }
      } catch (error) {
        ERROR(`Error getting ports: ${error}`);
      }
    };

    fetchPorts();
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.popup} className='flex flex-col text-black'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Add Content</h1>
          <button
            onClick={onClose}
            className='-mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition-all duration-200 hover:bg-gray-200 hover:shadow-lg'
          >
            ✖
          </button>
        </div>

        <div>
          <label className='block text-left text-lg font-medium'>Name</label>
          <input
            type='text'
            className='w-full rounded border border-gray-300 p-2'
            value={name}
            maxLength={25}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-left text-lg font-medium'>Port</label>
          <select
            className='w-full rounded border border-gray-300 p-2'
            value={selectedPort || ''}
            onChange={(e) => setSelectedPort(e.target.value as string)}
          >
            <option value='' disabled>
              Select port...
            </option>
            {ports.map((port, index) => (
              <option key={index} value={port}>
                {port}
              </option>
            ))}
          </select>
        </div>

        <form className='mt-4 space-y-4'>
          <div>
            <label className='block text-left text-lg font-medium'>
              Series Type
            </label>
            <select
              className='w-full rounded border border-gray-300 p-2'
              value={seriesType}
              onChange={(e) => setSeriesType(e.target.value as ChartType)}
            >
              <option value='rigid-line'>Rigid Line</option>
              <option value='smooth-line'>Smooth Line</option>
              <option value='bar'>Bar</option>
            </select>
          </div>

          <div>
            <label className='block text-left text-lg font-medium'>
              X-Axis Type
            </label>
            <select
              className='w-full rounded border border-gray-300 p-2'
              value={xAxisType}
              onChange={(e) => setXAxisType(e.target.value as DataOption)}
            >
              <option value='category'>Category</option>
              <option value='value'>Value</option>
            </select>
          </div>

          <div>
            <label className='block text-left text-lg font-medium'>
              X-Axis Data (comma-separated)
            </label>
            <input
              type='text'
              className='w-full rounded border border-gray-300 p-2'
              value={xAxisData}
              onChange={(e) => setXAxisData(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-left text-lg font-medium'>
              Y-Axis Type
            </label>
            <select
              className='w-full rounded border border-gray-300 p-2'
              value={yAxisType}
              onChange={(e) => setYAxisType(e.target.value as DataOption)}
            >
              <option value='value'>Value</option>
              <option value='category'>Category</option>
            </select>
          </div>

          <div>
            <label className='block text-left text-lg font-medium'>
              Series Data (comma-separated)
            </label>
            <input
              type='text'
              className='w-full rounded border border-gray-300 p-2'
              value={seriesData}
              onChange={(e) => setSeriesData(e.target.value)}
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={handleSubmit}
              disabled={!selectedPort} // Disable if port is null or undefined
              className={`mt-5 rounded-full px-4 py-2 text-xl font-bold transition-all duration-200 ${!selectedPort ? 'cursor-not-allowed bg-gray-300 text-gray-500' : 'hover:bg-blue-200 hover:shadow-lg'}`}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    width: '40vw',
  },
};

export default GridSpotPopup;
