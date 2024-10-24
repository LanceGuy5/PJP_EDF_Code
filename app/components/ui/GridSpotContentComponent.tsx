import { Grapher } from '@/app/classes/Grapher';
import { useEffect, useRef, useState } from 'react';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { ECBasicOption } from 'echarts/types/dist/shared';

interface GridSpotContentProps {
  options: ECBasicOption;
  name: string;
  editMode: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  onDelete: () => void;
}

/**
 * Act as wrapper for grid content!
 */
export default function GridSpotContentComponent({
  options,
  name,
  editMode,
  x,
  y,
  width,
  height,
  onDelete,
}: GridSpotContentProps) {
  const [running, setRunning] = useState(false);
  const [retracted, setRetracted] = useState(false);

  const chartRef = useRef<ECharts | null>(null); // Create a ref to hold the chart instance
  const seriesRef = useRef<{ x: number; y: number }[]>([]); // Ref for persistent series data
  const grapher = new Grapher(chartRef); // Grapher that can map to a serial port

  // TODO MAKE THIS WORK LATER
  // onDelete = () => {
  //   if (chartRef.current) {
  //     LOG('Destroying chart...');
  //     chartRef.current.clear();
  //     chartRef.current.dispose();
  //   }
  // }

  // TODO setXXX functions are for moving/resizing
  const [trueWidth, setTrueWidth] = useState(width);
  const [trueHeight, setTrueHeight] = useState(height);
  const [trueX, setTrueX] = useState(x);
  const [trueY, setTrueY] = useState(y);

  // for moving grid objects
  const [dragging, setDragging] = useState(false);
  // const [resizing, setResizing] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number } | null>({
    startX: x,
    startY: y,
  });
  // const resizeStartRef = useRef<{ startWidth: number; startHeight: number } | null>(null);

  useEffect(() => {
    // Create and mount the chart when the component mounts
    chartRef.current = echarts.init(
      document.getElementById('chartContainer') as HTMLDivElement
    );

    setInterval(() => {
      if (running) {
        grapher.tick();
      }
    }, 20);

    // Display the chart using the configuration items and data just specified.
    chartRef.current.setOption(options);
  });

  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartRef.current = {
      startX: e.clientX - trueX,
      startY: e.clientY - trueY,
    };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStartRef.current) return;
    setTrueX(e.clientX - dragStartRef.current.startX);
    setTrueY(e.clientY - dragStartRef.current.startY);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  // const handleResizeStart = (e: React.MouseEvent) => {
  //   setResizing(true);
  //   resizeStartRef.current = { startWidth: trueWidth, startHeight: trueHeight };
  // };

  // const handleResizeMove = (e: React.MouseEvent) => {
  //   if (!resizing || !resizeStartRef.current) return;
  //   setTrueWidth(resizeStartRef.current.startWidth + (e.clientX - trueX - trueWidth));
  //   setTrueHeight(resizeStartRef.current.startHeight + (e.clientY - trueY - trueHeight));
  // };

  // const handleResizeEnd = () => setResizing(false);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${trueX}px`,
        top: `${trueY}px`,
        width: `${trueWidth}px`,
        height: `${trueHeight}px`,
        zIndex: 1000, // Ensure it's on top, you can adjust the value as needed
        // transform: `translate(-50%, -50%)`, // Center the component around the (x, y) point
        backgroundColor: 'white',
        padding: '6px',
      }}
      className={
        !editMode
          ? 'grid-spot-content'
          : `grid-spot-content-edit cursor-${dragging ? 'grabbing' : 'grab'}`
      }
      onMouseMove={editMode ? handleDragMove : () => {}}
      onMouseUp={editMode ? handleDragEnd : () => {}}
      onMouseLeave={editMode ? handleDragEnd : () => {}}
    >
      <header
        className={`content-header flex flex-row items-center justify-between`}
        onMouseDown={editMode ? handleDragStart : () => {}}
        style={{ cursor: editMode ? 'move' : 'auto' }}
      >
        <p className='text-black' style={{ userSelect: 'none' }}>
          {name}
        </p>
        {editMode && (
          <button
            onClick={onDelete}
            style={{
              position: 'absolute',
              top: '-15px',
              left: '-15px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'red',
              color: 'white',
              cursor: 'pointer',
              zIndex: 1005,
              userSelect: 'none',
            }}
          >
            ✖
          </button>
        )}
        <button
          onClick={() => {
            setRetracted(!retracted);
          }}
        >
          <p className='text-black' style={{ userSelect: 'none' }}>
            {retracted ? '▼' : '▲'}
          </p>
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
          style={{ userSelect: 'none' }}
        >
          {!running ? '▶' : '⏹'}
        </button>
      </header>
      <div id='chartContainer' className='h-full w-full' />
      {/* Cover for edit mode -> uninteractable */}
      {editMode && (
        <>
          <div
            className='absolute inset-0 bg-white opacity-50'
            style={{
              zIndex: 1001,
              pointerEvents: 'auto',
            }}
            // just in case?
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          />
        </>
      )}
    </div>
  );
}
