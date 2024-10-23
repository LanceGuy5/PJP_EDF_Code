import { ECBasicOption } from 'echarts/types/dist/shared';
import React from 'react';

interface InfoPopupProps {
  onClose: () => void;
  onConfirm: (content: ECBasicOption) => void;
}

const GridSpotPopup: React.FC<InfoPopupProps> = ({ onClose, onConfirm }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup} className='flex flex-col text-black'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Add Content</h1>
          <button
            onClick={onClose}
            className='-mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition-all duration-200 hover:bg-gray-200 hover:shadow-lg'
          >
            ✖
          </button>
        </div>
        <p className='mt-1.5 text-xl'>DEVELOP THIS SCREEN HAHAHA</p>
        <div className='flex justify-end'>
          <button
            onClick={() => {
              onConfirm({}); // TODO null for now
            }}
            className='mt-5 rounded-full px-4 py-2 text-xl font-bold transition-all duration-200 hover:bg-blue-200 hover:shadow-lg'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    width: '40vw',
  },
  closeButton: {
    marginTop: '20px',
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  createButton: {
    marginTop: '20px',
    padding: '8px 16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default GridSpotPopup;
