'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Dashboard from '../classes/Dashboard';
import GridSpotContent from '../classes/GridSpotContent';
import GridSpot from './ui/GridSpot';
import GridSpotPopup from './ui/GridSpotPopup';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { LOG } from '../helpers/util';

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

  // editing dashboard name
  const [isEditing, setIsEditing] = useState(false);
  const [dashboardName, setDashboardName] = useState(dashboard.getName());

  function addGrid(chartType: ECBasicOption) {
    setGrids((currData) => [
      ...currData,
      new GridSpotContent(
        chartType,
        window.innerWidth / 2,
        window.innerHeight / 2,
        400,
        400
      ),
    ]);
    setNumBoxes((currVal) => (currVal += 1));
    LOG('BOXES: ' + numBoxes);
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

  return (
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
                {/*TODO fix illegal characters*/}
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
            className={`w-12 transform rounded-md ${!running ? 'bg-green-500' : 'bg-red-500'} px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105`}
          >
            {!running ? '▶' : '⏹'}
          </button>
          <button
            onClick={() => setAdding(true)}
            className='w-32 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
          >
            Add Content
          </button>
          {adding && (
            <GridSpotPopup
              onClose={() => setAdding(false)}
              onConfirm={(content: ECBasicOption) => {
                addGrid(content); // this is what selection ends up going to
                setAdding(false);
              }}
            />
          )}
          <button
            onClick={() => setEditState(!editState)}
            className='w-20 transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
          >
            <div className={editState ? 'font-bold' : ''}>
              {editState ? 'Done' : 'Edit'}
            </div>
          </button>
          <button
            onClick={saveDashboard}
            className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
          >
            Save
          </button>
          <button
            onClick={exportDashboard}
            className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
          >
            Export
          </button>
          <button
            onClick={loadDashboard}
            className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
          >
            Load
          </button>
        </div>
      </header>

      {grids.map((x: GridSpotContent, index) => (
        <GridSpot
          key={index}
          content={x}
          editMode={editState}
          x={x.getX()}
          y={x.getY()}
          width={x.getWidth()}
          height={x.getHeight()}
        />
      ))}
    </div>
  );
}
