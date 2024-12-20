import Dashboard from '@/app/classes/Dashboard';
import React, { useState } from 'react';

interface InfoPopupProps {
  onClose: () => void;
  setDashboard: (d: Dashboard | null) => void;
}

const createDashboard = (
  setDashboard: (d: Dashboard | null) => void,
  name: string,
  onClose: () => void
) => {
  setDashboard(new Dashboard(name));
  onClose();
};

const InfoPopup: React.FC<InfoPopupProps> = ({ onClose, setDashboard }) => {
  const [name, setName] = useState('');

  // Function to handle changes in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value); // Update the state with the input value
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup} className='flex flex-col text-black'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>New Dashboard</h1>
          <button
            onClick={onClose}
            className='-mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold transition-all duration-200 hover:bg-gray-200 hover:shadow-lg'
          >
            ✖
          </button>
        </div>
        <div className='flex flex-row'>
          <p className='mt-1.5 text-xl'>Name</p>
          <input
            className='ml-5 rounded border border-gray-300 p-2'
            name='myInput'
            placeholder='Fun Name :)'
            value={name} // Bind the input to the state
            onChange={handleInputChange} // Handle input changes
          />
        </div>
        <div className='flex justify-end'>
          <button
            onClick={() => createDashboard(setDashboard, name, onClose)}
            className='mt-5 rounded-full px-4 py-2 text-xl font-bold transition-all duration-200 hover:bg-blue-200 hover:shadow-lg'
          >
            Create
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

export default InfoPopup;
