import GridSpotContent from '@/app/classes/GridSpotContent';
import GridSpotContentComponent from './GridSpotContentComponent';
import { useState } from 'react';

interface GridSpotProps {
  index: number;
  content: GridSpotContent;
  editMode: boolean;
  onDelete: (x: number) => void;
}

export default function GridSpot({
  index,
  content,
  editMode,
  onDelete,
}: GridSpotProps) {
  // TODO setXXX functions are for moving/resizing
  const [trueWidth, setTrueWidth] = useState(content.getWidth());
  const [trueHeight, setTrueHeight] = useState(content.getHeight());
  const [trueX, setTrueX] = useState(content.getX());
  const [trueY, setTrueY] = useState(content.getY());
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: `${trueX}px`,
          top: `${trueY}px`,
          width: `${trueWidth}px`,
          height: `${trueHeight}px`,
          zIndex: 1, // Ensure it's on top, you can adjust the value as needed
          // transform: `translate(-50%, -50%)`, // Center the component around the (x, y) point
        }}
      >
        <div className='grid-spot'>
          <GridSpotContentComponent
            index={index}
            name={'TESTING'}
            editMode={editMode}
            content={content}
            onDelete={onDelete}
            onMoveX={setTrueX}
            onMoveY={setTrueY}
            onMoveW={setTrueWidth}
            onMoveH={setTrueHeight}
          />
        </div>
      </div>
    </>
  );
}
