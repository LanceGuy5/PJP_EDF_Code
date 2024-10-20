import GridSpotContent from '@/app/classes/GridSpotContent';
import { useState } from 'react';
import GridSpotPopup from './GridSpotPopup';

interface GridSpotProps {
  editMode: boolean;
  content: GridSpotContent; // Whether the dashboard is in edit mode
}

export default function GridSpot({ editMode, content }: GridSpotProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [size, setSize] = useState<number>(50);
  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  function changeDim(newSize: number) {
    setSize(newSize);
  }
  return (
    <>
      <div
        className={`${content ? 'grid-spot' : 'grid-spot-nonadj'} transition-all duration-200`}
      >
        {content ? (
          editMode ? (
            <p>EDIT MODE</p>
          ) : (
            <p>{content.render()}</p>
          )
        ) : editMode ? (
          <button
            onClick={() => handleShowPopup()}
            className='grid-spot-text flex h-12 w-12 items-center justify-center rounded-full opacity-0 transition-all duration-200 hover:bg-backgroundHover hover:opacity-100 hover:shadow-lg'
          >
            +
          </button>
        ) : null}
      </div>
      {/* {showPopup && (
        <GridSpotPopup onClose={handleClosePopup} onConfirm={() => return null} />
      )} */}
    </>
  );
}
