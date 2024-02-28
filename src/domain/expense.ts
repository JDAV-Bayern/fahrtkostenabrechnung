export type ExpenseType = 'bike' | 'car' | 'train' | 'plan';
export type Direction = 'inbound' | 'onsite' | 'outbound';

export interface Expense {
  type: ExpenseType;
  origin: string;
  destination: string;
}

export interface BikeExpense extends Expense {
  type: 'bike';
  distance: number;
}

export interface CarExpense extends Expense {
  type: 'car';
  distance: number;
  carType: 'combustion' | 'electric' | 'plug-in-hybrid';
  passengers: string[];
}

export interface TrainExpense extends Expense {
  type: 'train';
  discountCard: 'BC25' | 'BC50' | 'none';
  price: number;
}

export interface PublicTransportPlanExpense extends Expense {
  type: 'plan';
}
