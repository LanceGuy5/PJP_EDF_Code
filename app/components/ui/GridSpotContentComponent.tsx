import { useEffect, useRef, useState } from 'react';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import GridSpotContent from '@/app/classes/GridSpotContent';

interface GridSpotContentProps {
  index: string;
  name: string;
  editMode: boolean;
  content: GridSpotContent;
  onDelete: (x: string) => void;
  onMoveX: (x: number) => void;
  onMoveY: (y: number) => void;
  onMoveW: (w: number) => void;
  onMoveH: (h: number) => void;
}

const OFFSET_CONST = 72; // TODO SHOULDN'T BE HARDCODED

/**
 * Act as wrapper for grid content!
 */
export default function GridSpotContentComponent({
  index,
  name,
  editMode,
  content,
  onDelete,
  onMoveX,
  onMoveY,
  onMoveW,
  onMoveH,
}: GridSpotContentProps) {
  const [running, setRunning] = useState(false);
  const [retracted, setRetracted] = useState(false);

  const chartRef = useRef<ECharts | null>(null); // Create a ref to hold the chart instance
  // TODO for rendering on graph
  const seriesRef = useRef<{ x: number; y: number }[]>([]); // Ref for persistent series data
  const xScale = useRef([0, 1]);

  const [trueWidth, setTrueWidth] = useState(content.getWidth());
  const [trueHeight, setTrueHeight] = useState(content.getHeight());
  const [trueX, setTrueX] = useState(content.getX());
  const [trueY, setTrueY] = useState(content.getY());

  function updateX(x: number) {
    setTrueX(x);
    content.setX(x);
    onMoveX(x);
  }

  function updateY(y: number) {
    y = Math.max(y, OFFSET_CONST);
    setTrueY(y);
    content.setY(y);
    onMoveY(y);
  }

  function updateWidth(w: number) {
    setTrueWidth(w);
    content.setWidth(w);
    onMoveW(w);
    chartRef.current?.resize();
  }

  function updateHeight(h: number) {
    setTrueHeight(h);
    content.setHeight(h);
    onMoveH(h);
    chartRef.current?.resize();
  }

  // for moving/resizing grid objects
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number } | null>({
    startX: trueX,
    startY: trueY,
  });
  const resizeStartRef = useRef<{
    startWidth: number;
    startHeight: number;
  } | null>(null);

  useEffect(() => {
    // Clean up existing chart instance if it exists
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    // Initialize a new chart instance
    const container = document.getElementById(
      `chartContainer-${index}`
    ) as HTMLDivElement;
    chartRef.current = echarts.init(container);

    // Set initial chart options
    chartRef.current.setOption(content.getOptions());
    chartRef.current.setOption({
      series: [{ type: 'line', data: [] }],
    });

    // Cleanup on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [content, index]);

  function parseTimeStamp(timeStamp: string) {
    const vals = timeStamp.split(':');
    let secs = parseFloat(vals[2] + '.' + vals[3]);
    if (vals[1] != '00') {
      secs += parseFloat(vals[1]) * 60;
    }
    return secs;
  }

  useEffect(() => {
    const dataUpdateHandler = (data: string) => {
      const temp: string[] = data.split(',');
      const obj = {
        x: parseTimeStamp(temp[0]),
        y: parseFloat(temp[1]),
      };
      seriesRef.current.push(obj);

      if (obj.x > xScale.current[xScale.current.length - 1]) {
        xScale.current.push(obj.x);
      }

      chartRef.current?.setOption({
        xAxis: [
          {
            type: 'category',
            data: xScale.current,
          },
        ],
        series: [
          {
            data: seriesRef.current.map((d) => d.y),
          },
        ],
      });
    };

    // Attach the listener
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).electronAPI.dataUpdate(content.getId(), dataUpdateHandler);

    // Cleanup the listener on unmount or rerender
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).electronAPI.removeListener(
        `dataUpdate`, // i don't think we need to pass id here
        dataUpdateHandler
      );
    };
  });

  const readData = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // TODO WE NEED TO FEED IN seriesRef
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).electronAPI.readFromPort({
        path: content.getPortPath(),
        options: {
          baudRate: 9600,
        },
        index: index,
      });
    } else {
      console.log('Electron API not available in this environment');
    }
  };

  const stopReading = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // TODO WE NEED TO FEED IN seriesRef
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (window as any).electronAPI.stopReading({
        path: content.getPortPath(),
        index: index,
      });
      return result;
    } else {
      console.log('Electron API not available in this environment');
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    // do not let y go past the header:
    dragStartRef.current = {
      startX: e.clientX - trueX,
      startY: e.clientY - trueY,
    };
  };

  const handleDragMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging || !dragStartRef.current) return;
    updateX(e.clientX - dragStartRef.current.startX);
    updateY(e.clientY - dragStartRef.current.startY);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    dragStartRef.current = { startX: e.clientX, startY: e.clientY };
    resizeStartRef.current = { startWidth: trueWidth, startHeight: trueHeight };
  };

  const handleResizeMove = (
    e: React.MouseEvent,
    direction: 'v' | 'h' | 'vh'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!resizing || !resizeStartRef.current) return;

    const newWidth =
      resizeStartRef.current.startWidth +
      (e.clientX - dragStartRef.current!.startX);
    const newHeight =
      resizeStartRef.current.startHeight +
      (e.clientY - dragStartRef.current!.startY);

    if (direction === 'v') updateHeight(newHeight);
    else if (direction === 'h') updateWidth(newWidth);
    else if (direction === 'vh') {
      updateWidth(newWidth);
      updateHeight(newHeight);
    }

    // updateWidth(newWidth);
    // updateHeight(newHeight);
  };

  const handleResizeEnd = () => setResizing(false);

  return (
    <div
      style={{
        position: 'relative',
        left: '0px', //`${trueX}px`,
        top: '0px', //`${trueY}px`,
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
          : `grid-spot-content-edit cursor-${dragging ? 'grabbing' : 'grab'}` // TODO why this not working
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
        <p
          className='ml-4 text-xl font-bold text-black'
          style={{ userSelect: 'none' }}
        >
          {name}
        </p>
        {editMode && (
          <button
            onClick={() => {
              if (chartRef.current) {
                chartRef.current.clear();
                chartRef.current.dispose();
              }
              onDelete(index);
            }}
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
            if (running) {
              stopReading();
            } else {
              seriesRef.current = [];
              xScale.current = [0, 1];
              readData();
            }
            setRunning(!running);
          }}
          className={`w-12 transform rounded-md ${
            !running ? 'bg-green-500' : 'bg-red-500'
          } px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105`}
          style={{ userSelect: 'none' }}
        >
          {!running ? '▶' : '⏹'}
        </button>
      </header>
      <div id={`chartContainer-${index}`} className='h-full w-full' />
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
          <div
            className='absolute bottom-0 right-0 -m-5 h-full w-10 cursor-ew-resize bg-gray-500 opacity-0'
            style={{
              zIndex: 1002,
              // pointerEvents: 'none',
            }}
            onMouseDown={handleResizeStart}
            onMouseMove={(e) => {
              handleResizeMove(e, 'h');
            }}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          />
          <div
            className={`absolute bottom-0 right-0 -m-5 h-10 w-full cursor-ns-resize bg-gray-500 opacity-0`}
            style={{
              zIndex: 1002,
              // pointerEvents: 'none',
            }}
            onMouseDown={handleResizeStart}
            onMouseMove={(e) => {
              handleResizeMove(e, 'v');
            }}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          />
          <div
            className='absolute bottom-0 right-0 -m-5 h-10 w-10 cursor-nwse-resize bg-gray-500 opacity-0'
            style={{
              zIndex: 1003,
              // pointerEvents: 'none',
            }}
            onMouseDown={handleResizeStart}
            onMouseMove={(e) => {
              handleResizeMove(e, 'vh');
            }}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
          />
        </>
      )}
    </div>
  );
}
