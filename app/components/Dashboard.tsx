'use client';

import { useState } from 'react';
import Dashboard from '../classes/Dashboard';
import GridSpotContent from '../classes/GridSpotContent';
import GridSpot from './ui/GridSpot';

// TODO figure out a way to make this better
const rows = 6; // Number of rows
const cols = 11; // Number of columns

const grid: GridSpotContent[][] = Array(rows)
  .fill(null)
  .map(() => Array(cols).fill(null));

interface DashboardRendererProps {
  dashboard: Dashboard;
}

// MY VISION:
// Only spots adjacent to a spot with content have an outline
// if no spots have content, treat top-left as having content, and that is it!

export default function DashboardRenderer({
  dashboard,
}: DashboardRendererProps) {
  const [editState, setEditState] = useState(false);
  return (
    <div>
      <header className='dashboard-header'>
        <h1>{dashboard.getName()}</h1>
        <button
          onClick={() => setEditState(!editState)}
          className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
        >
          <div className={editState ? 'font-bold' : ''}>
            {editState ? 'Done' : 'Edit'}
          </div>
        </button>
      </header>
      <div className='grid-container'>
        {grid.map((row, i) => (
          <div key={i} className='grid-row'>
            {row.map((cell, j) => (
              <GridSpot key={`${i}-${j}`} content={cell} editMode={editState} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
