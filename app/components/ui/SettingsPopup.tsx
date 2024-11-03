import { DashboardSettings } from '@/app/types/ChartOptions';
import React, { useState } from 'react';

interface SettingsPopupProps {
  settings: DashboardSettings;
  onClose: () => void;
  onConfirm: (settings: DashboardSettings) => void;
}

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  settings,
  onClose,
  onConfirm,
}) => {
  // Form state to manage user input
  const [defaultSchema, setDefaultSchema] = useState<string[]>(
    settings.defaultSchema
  );

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

        <form className='mt-4 space-y-4'>
          <div>
            <label className='block text-left text-lg font-medium'>
              Default Schema
            </label>
            <input
              type='text'
              className='w-full rounded border border-gray-300 p-2'
              value={defaultSchema.join(',')}
              onChange={(e) => setDefaultSchema(e.target.value.split(','))}
            />
          </div>

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() =>
                onConfirm({
                  defaultSchema: defaultSchema,
                })
              }
              className={`mt-5 rounded-full px-4 py-2 text-xl font-bold transition-all duration-200 hover:bg-blue-200 hover:shadow-lg`}
            >
              Add
            </button>
          </div>
        </form>
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
};

export default SettingsPopup;
