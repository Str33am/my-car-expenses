
export interface IRootState {
  readonly app: App;
}

interface App {
  readonly appState: AppState;
}

export interface AppState {
  readonly user?: User;
  readonly myCar?: CarData;
  readonly carsToCompareState?: CarData[];
  readonly filters: IFilters;
  readonly myFilters: IFilters;
  readonly expensesFilter: string;
};

export interface User {
  email?: string;
  username?: string;
  car?: CarData;
}

export interface IFilters {
  fuel: boolean,
  maintenance: boolean,
  service: boolean,
  tax: boolean
}

export interface CarData {
  id: string;
  car: Car;
  mileage: number;
  fuelType: FUELTYPE;
  mileageTolerance: number;
  yearTolerance: number;
  milesTolerance: number;
  expenses: IExpenses;
}

export interface IExpenses {
  fuelExpenses: IFuelExpense[];
  serviceExpenses: IServiceExpense[];
  maintenanceExpenses: IMaintenanceExpense[];
  roadTaxExpenses: IRoadTaxExpense[];
}

export interface IMaintenanceExpense {
  id: string;
  date: Date;
  mileage: number;
  cost: number;
}

export interface IServiceExpense {
  id: string;
  date: Date;
  mileage: number;
  cost: number;
}

export interface IFuelExpense {
  id: string;
  date: Date;
  costPerUnit: number;
  quantity: number;
  mileage: number;
}

export interface IRoadTaxExpense {
  id: string;
  date: Date;
  mileage: number;
  cost: number;
}

export type OptionType = {
  value: string | number;
  label: string | number;
}

export type CarChartData = {
  Name: string;
  Fuel: number;
  Service: number;
  Maintenance: number;
  'Road Tax': number;
};

export enum FUELTYPE {
  PETROL = "Petrol",
  DIESEL = "Diesel",
  ELECTRIC = "Electric",
  HYBRID = "Hybrid",
}

export type Car = {
  year: number;
  make: string;
  model: string;
}

export type Order = 'asc' | 'desc';

export const Months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
