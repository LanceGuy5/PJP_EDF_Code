export type ChartType = 'rigid-line' | 'smooth-line' | 'bar';
export type DataOption = 'category' | 'value';
export type DataTypes = 'temp' | 'load' | 'fuel_flow' | 'air_velocity';
export type Schema = {
  time: string;
  temp: number;
  load: number;
  fuel_flow: number;
  air_velocity: number;
};
export type XAxisData = 'time';
export type DashboardSettings = {
  defaultSchema: string[];
};
