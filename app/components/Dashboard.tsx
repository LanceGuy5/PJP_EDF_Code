'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Dashboard from '../classes/Dashboard';
import GridSpotContent from '../classes/GridSpotContent';
import GridSpot from './ui/GridSpot';
import GridSpotPopup from './ui/GridSpotPopup';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { ERROR, LOG } from '../helpers/util';

import { v4 as uuid } from 'uuid';
import SettingsPopup from './ui/SettingsPopup';
import { DashboardSettings, XAxisData } from '../types/ChartOptions';

// TESTING FUNCTIONS FOR API ROUTES:

const listPorts = async () => {
  try {
    LOG('Listing ports...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: string = await (window as any).electronAPI.listPorts();
      const ret = result.substring(0, result.length - 1).split('&');
      console.log(ret);
    } else {
      LOG('Electron API not available in this environment');
    }
  } catch (error) {
    ERROR(`Error loading dashboard: ${error}`);
  }
};

async function readFromPort(): Promise<void> {
  try {
    LOG('Listing ports...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (window as any).electronAPI.readFromPort({
        path: '/dev/tty.usbmodem1101',
        options: {
          baudRate: 9600,
        },
        index: 0,
      });
      LOG(result);
    } else {
      LOG('Electron API not available in this environment');
    }
  } catch (error) {
    ERROR(`bro: ${error}`);
  }
}

async function stopAllReadings(): Promise<void> {
  try {
    LOG('Stopping readings...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (window as any).electronAPI.stopReading({
        path: '/dev/tty.usbmodem1101',
        index: 0,
      });
      LOG(result);
    } else {
      LOG('Electron API not available in this environment');
    }
  } catch (error) {
    ERROR(`bro: ${error}`);
  }
}

// END TESTING FUNCTIONS

function saveDashboard() {
  // TODO functionality to save dashboard
}

function loadDashboard() {
  // TODO functionality to load dashboard
}

function exportDashboard() {
  // TODO functionality to export dashboard
}

function runAll() {
  // TODO functionality to run all grid spots
}

function stopAll() {
  // TODO functionality to run all grid spots
}

interface DashboardRendererProps {
  dashboard: Dashboard;
}

export default function DashboardRenderer({
  dashboard,
}: DashboardRendererProps) {
  const [numBoxes, setNumBoxes] = useState<number>(0);
  const [grids, setGrids] = useState<GridSpotContent[]>([]);
  const [running, setRunning] = useState(false); // this runs ALL GRID SPOTS
  const [editState, setEditState] = useState(false); // this is for editing the dashboard
  const [adding, setAdding] = useState(false); // this is for adding a grid spot
  const [settings, isSettings] = useState(false); // this is for settings
  const [dashboardSettings, setDashboardSettings] = useState({
    defaultSchema: [''],
  });
  const isTesting = false; // this is for testing the dashboard

  // editing dashboard name
  const [isEditing, setIsEditing] = useState(false);
  const [dashboardName, setDashboardName] = useState(dashboard.getName());

  function addGrid(
    options: ECBasicOption,
    port: string,
    name: string,
    data: [XAxisData, number]
  ) {
    const tempId = uuid();
    console.log('ADDING', tempId);
    setGrids((currData) => [
      ...currData,
      new GridSpotContent(
        name,
        options,
        window.innerWidth / 2 + 20 * numBoxes - 200,
        window.innerHeight / 2 + 20 * numBoxes - 200,
        400,
        400,
        port,
        tempId,
        data
      ),
    ]);
    setNumBoxes((currVal) => (currVal += 1));
  }

  function removeGrid(uuid: string) {
    console.log('REMOVING', uuid);
    setGrids((currData) => currData.filter((x) => x.getId() !== uuid));
    setNumBoxes((currVal) => (currVal -= 1));
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') setDashboardName(dashboard.getName()); // Reset the name if it's empty
    setDashboardName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (dashboardName === '') setDashboardName(dashboard.getName()); // Reset the name if it's empty
    dashboard.setName(dashboardName); // Save the new name in the dashboard object
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (dashboardName === '') setDashboardName(dashboard.getName()); // Reset the name if it's empty
      dashboard.setName(dashboardName); // Save the new name when Enter is pressed
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setDashboardName(dashboard.getName()); // Reset the name
    }
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const updateWidth = () => {
    if (spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      setInputWidth(spanWidth > 10 ? spanWidth : 10); // Set a minimum width
    }
  };

  // Recalculate width whenever the dashboardName changes
  useEffect(() => {
    updateWidth();
  }, [dashboardName]);

  return isTesting ? (
    <>
      <div className='flex-rows mt-10 flex justify-center'>
        <button
          onClick={() => listPorts()}
          className='w-32 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
        >
          <div style={{ userSelect: 'none' }}>LIST PORTS</div>
        </button>
        <button
          onClick={() => readFromPort()}
          className='w-32 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
        >
          <div style={{ userSelect: 'none' }}>READ FROM PORT</div>
        </button>
        <button
          onClick={() => stopAllReadings()}
          className='w-32 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
        >
          <div style={{ userSelect: 'none' }}>STOP READING</div>
        </button>
      </div>
    </>
  ) : (
    <div>
      <header className='dashboard-header'>
        <div className='flex flex-row gap-4'>
          <Image src='/img/doc.png' alt='logo' width={30} height={30} />
          <div className={`text-xl ${isEditing ? 'text-black' : 'text-white'}`}>
            {isEditing ? (
              <>
                <span
                  ref={spanRef}
                  className='invisible absolute'
                  style={{
                    whiteSpace: 'pre',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    padding: '5px',
                  }}
                >
                  {dashboardName}
                </span>
                <input
                  type='text'
                  value={dashboardName}
                  onChange={handleNameChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  maxLength={50}
                  style={{
                    width: inputWidth ? `${inputWidth + 5}px` : 'auto',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                  className='mt-1.5 rounded-md border-b-2 border-gray-400 focus:outline-none'
                  autoFocus
                />
              </>
            ) : (
              <h1
                onClick={() => setIsEditing(true)}
                className='mt-1.5 cursor-pointer'
              >
                {dashboardName}
              </h1>
            )}
          </div>
        </div>
        <div className='flex flex-row gap-4'>
          <button
            onClick={() => {
              setRunning(!running);
              if (running) stopAll();
              else runAll();
            }}
            disabled={editState}
            className={`w-12 transform rounded-md ${editState ? 'cursor-not-allowed bg-green-300' : !running ? 'bg-green-500 hover:scale-105' : 'bg-red-500 hover:scale-105'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div style={{ userSelect: 'none' }}>{!running ? '▶' : '⏹'}</div>
          </button>
          <button
            onClick={() => setAdding(true)}
            disabled={editState}
            className={`w-32 transform rounded-md ${editState ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div style={{ userSelect: 'none' }}>Add Content</div>
          </button>
          {adding && (
            <GridSpotPopup
              onClose={() => setAdding(false)}
              onConfirm={(
                content: ECBasicOption,
                port: string,
                name: string,
                data: [XAxisData, number]
              ) => {
                addGrid(content, port, name, data);
                setAdding(false);
              }}
              settings={dashboardSettings}
            />
          )}
          <button
            onClick={() => setEditState(!editState)}
            disabled={running}
            className={`w-20 transform rounded-md ${running ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div className={editState ? 'font-bold' : ''}>
              <div style={{ userSelect: 'none' }}>
                {editState ? 'Done' : 'Edit'}
              </div>
            </div>
          </button>
          <button
            onClick={saveDashboard}
            disabled={editState}
            className={`transform rounded-md ${editState ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div style={{ userSelect: 'none' }}>Save</div>
          </button>
          <button
            onClick={exportDashboard}
            disabled={editState}
            className={`transform rounded-md ${editState ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div style={{ userSelect: 'none' }}>Export</div>
          </button>
          <button
            onClick={loadDashboard}
            disabled={editState}
            className={`transform rounded-md ${editState ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div style={{ userSelect: 'none' }}>Load</div>
          </button>
          <button
            onClick={() => isSettings(true)}
            disabled={editState}
            className={`transform rounded-md ${editState ? 'cursor-not-allowed bg-blue-300 text-gray-500' : 'bg-blue-500 hover:scale-105 hover:bg-blue-600'} px-4 py-2 text-white transition-all duration-300 ease-in-out`}
          >
            <div
              style={{
                userSelect: 'none',
                transform: 'scale(1.5)',
                display: 'inline-block',
              }}
            >
              ⚙
            </div>
          </button>
          {settings && (
            <SettingsPopup
              onClose={() => isSettings(false)}
              onConfirm={(content: DashboardSettings) => {
                setDashboardSettings(content);
                isSettings(false);
              }}
              settings={dashboardSettings}
            />
          )}
        </div>
      </header>

      {grids.map((x: GridSpotContent) => (
        <GridSpot
          key={x.getId()}
          index={x.getId()}
          content={x}
          editMode={editState}
          onDelete={() => removeGrid(x.getId())}
        />
      ))}
    </div>
  );
}
