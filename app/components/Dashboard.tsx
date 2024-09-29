'use client';

import Dashboard from '../classes/Dashboard';

interface DashboardRendererProps {
  dashboard: Dashboard;
}

export default function DashboardRenderer({
  dashboard,
}: DashboardRendererProps) {
  return (
    <div>
      <h1>{dashboard.getName()}</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}
