'use client';

import { useState } from 'react';
import { ERROR, LOG } from './helpers/util';
import Image from 'next/image';
import Dashboard from './classes/Dashboard';
import DashboardRenderer from './components/Dashboard';
import InfoPopup from './components/ui/InfoPopup';
// import LineGraph from './components/LineGraph';

export default function Home() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);
  const loadDashboard = async () => {
    try {
      LOG('Loading dashboard...');
      setDashboardLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (window as any).electronAPI.loadDashboard();
        LOG(result); // handle result here
        setDashboardLoading(false);
      } else {
        LOG('Electron API not available in this environment');
      }
    } catch (error) {
      ERROR(`Error loading dashboard: ${error}`);
    }
  };
  // const listPorts = async () => {
  //   try {
  //     LOG('Listing ports...');
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     if (typeof window !== 'undefined' && (window as any).electronAPI) {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const result = await (window as any).electronAPI.listPorts();
  //       LOG(result);
  //     } else {
  //       LOG('Electron API not available in this environment');
  //     }
  //   } catch (error) {
  //     ERROR(`Error loading dashboard: ${error}`);
  //   }
  // };
  // async function readFromPort(): Promise<void> {
  //   try {
  //     LOG('Listing ports...');
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     if (typeof window !== 'undefined' && (window as any).electronAPI) {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const result = await (window as any).electronAPI.readFromPort({
  //         path: '/dev/tty.Bluetooth-Incoming-Port',
  //         options: {
  //           baudRate: 9600,
  //         },
  //       });
  //       LOG(result);
  //     } else {
  //       LOG('Electron API not available in this environment');
  //     }
  //   } catch (error) {
  //     ERROR(`bro: ${error}`);
  //   }
  // }

  return !dashboard ? (
    <>
      <div className='grid min-h-screen items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
        <main className='flex flex-col items-center gap-8'>
          <h1 className='text-center text-4xl font-bold sm:text-5xl'>
            PJP Metrics Suite
          </h1>
          <Image src='/icon.png' alt='logo' width={200} height={200} />
          <div className='flex flex-row items-center gap-8'>
            <button
              className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
              onClick={handleShowPopup}
            >
              New Dashboard
            </button>
            {dashboardLoading ? (
              <button
                className='transform cursor-not-allowed rounded-md bg-blue-300 px-4 py-2 text-white'
                disabled
              >
                Loading...
              </button>
            ) : (
              <button
                className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
                onClick={() => loadDashboard()}
              >
                Load Dashboard
              </button>
            )}
          </div>
          {showPopup && (
            <InfoPopup onClose={handleClosePopup} setDashboard={setDashboard} />
          )}
        </main>
      </div>
      <footer className='absolute bottom-0 w-full p-4 text-center font-[family-name:var(--font-geist-sans)] text-gray-300'>
        <p>❤️ from ecu squad</p>
      </footer>
    </>
  ) : (
    <>
      <DashboardRenderer dashboard={dashboard} />
    </>
    // <>
    //   <LineGraph />
    //   <button
    //     className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
    //     onClick={() => listPorts()}
    //   >
    //     Get Ports
    //   </button>
    //   <button
    //     className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
    //     onClick={() => readFromPort()}
    //   >
    //     READ FROM PORT
    //   </button>
    // </>
  );
}
