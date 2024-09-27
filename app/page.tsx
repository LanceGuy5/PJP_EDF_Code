'use client';

import { ERROR, LOG } from './helpers/util';

export default function Home() {
  const loadDashboard = async () => {
    try {
      LOG('Loading dashboard...');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (window as any).electronAPI.loadDashboard();
        LOG(result);
      } else {
        LOG('Electron API not available in this environment');
      }
    } catch (error) {
      ERROR(`Error loading dashboard: ${error}`);
    }
  };
  return (
    <>
      <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
        <main className='flex flex-col items-center gap-8'>
          <h1 className='text-center text-4xl font-bold sm:text-5xl'>
            PJP Metrics Suite
          </h1>
          <div className='flex flex-row items-center gap-4'>
            <button className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'>
              New Dashboard
            </button>
            <button
              className='transform rounded-md bg-blue-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-600'
              onClick={() => loadDashboard()}
            >
              Load Dashboard
            </button>
          </div>
          {/* <LineGraph /> */}
        </main>
      </div>
      <footer className='absolute bottom-0 w-full p-4 text-center text-gray-300'>
        <p>made with ❤️ by ecu squad</p>
      </footer>
    </>
  );
}
