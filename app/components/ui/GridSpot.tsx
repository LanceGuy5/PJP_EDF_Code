import GridSpotContent from '@/app/classes/GridSpotContent';
import { useState } from 'react';
import GridSpotPopup from './GridSpotPopup';

interface GridSpotProps {
  content: GridSpotContent | null; // Content for each grid spot
  editMode: boolean; // Whether the dashboard is in edit mode
}

// TODO make so that if content is on screen in edit mode, can be drag and dropped
export default function GridSpot({ content, editMode }: GridSpotProps) {
  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);
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
      {showPopup && (
        <GridSpotPopup onClose={handleClosePopup} content={content} />
      )}
    </>
  );
}
