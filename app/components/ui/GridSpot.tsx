import GridSpotContent from '@/app/classes/GridSpotContent';
import GridSpotContentComponent from './GridSpotContentComponent';
import { useState } from 'react';

interface GridSpotProps {
  content: GridSpotContent;
  editMode: boolean; // Whether the dashboard is in edit mode
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function GridSpot({
  content,
  editMode,
  x,
  y,
  width,
  height,
}: GridSpotProps) {
  // TODO setXXX functions are for moving/resizing
  const [trueWidth, setTrueWidth] = useState(width);
  const [trueHeight, setTrueHeight] = useState(height);
  const [trueX, setTrueX] = useState(x);
  const [trueY, setTrueY] = useState(y);
  return (
    <>
      <div
        style={{
          position: 'relative',
          left: `${trueX}px`,
          top: `${trueY}px`,
          width: `${trueWidth}px`,
          height: `${trueHeight}px`,
          zIndex: 1, // Ensure it's on top, you can adjust the value as needed
          transform: `translate(-50%, -50%)`, // Center the component around the (x, y) point
        }}
      >
        <div className='grid-spot'>
          <GridSpotContentComponent
            type={content.getContent()}
            name={'TESTING'}
            editMode={editMode}
            x={trueX}
            y={trueY}
            width={trueWidth}
            height={trueHeight}
          />
        </div>
      </div>
    </>
  );
}
