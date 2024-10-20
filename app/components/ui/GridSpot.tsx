import GridSpotContent from '@/app/classes/GridSpotContent';
import { useState } from 'react';
import GridSpotPopup from './GridSpotPopup';

interface GridSpotProps {
  editMode: boolean; // Whether the dashboard is in edit mode
}

export default function GridSpot({ editMode }: GridSpotProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState<GridSpotContent | null>(null);
  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);
  const addContent = (content: GridSpotContent | null) => {
    handleClosePopup();
    setContent(content);
  };
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
        <GridSpotPopup onClose={handleClosePopup} onConfirm={addContent} />
      )}
    </>
  );
}
