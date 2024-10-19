import { Grapher } from '@/app/classes/Grapher';
import { useState } from 'react';
import GrapherContent from '../GrapherContent';

interface GridSpotContentProps {
  grapher: Grapher;
}

/**
 * Act as wrapper for grid content!
 */
export default function GridSpotContent({ grapher }: GridSpotContentProps) {
  const [running, setRunning] = useState(false);
  return (
    <>
      <div className='graph-element flex h-screen items-center justify-center'>
        <div
          className='relative max-w-4xl rounded-lg bg-white p-4 shadow-lg'
          style={{ width: '600px', height: '400px' }}
        >
          <button
            onClick={() => {
              setRunning(!running);
              if (running) {
                grapher.start();
              } else {
                grapher.stop();
              }
            }}
            className={`w-12 transform rounded-md ${!running ? 'bg-green-500' : 'bg-red-500'} px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105`}
          >
            {!running ? '▶' : '⏹'}
          </button>
          <GrapherContent />
        </div>
      </div>
    </>
  );
}
