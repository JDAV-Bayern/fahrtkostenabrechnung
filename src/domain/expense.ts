export type ExpenseType = 'bike' | 'car' | 'train' | 'plan';
export type Direction = 'inbound' | 'onsite' | 'outbound';

export interface BaseExpense {
  type: ExpenseType;
  origin: string;
  destination: string;
}

export interface BikeExpense extends BaseExpense {
  type: 'bike';
  distance: number;
}

export interface CarExpense extends BaseExpense {
  type: 'car';
  distance: number;
  carType: 'combustion' | 'electric' | 'plug-in-hybrid';
  passengers: string[];
}

export interface TrainExpense extends BaseExpense {
  type: 'train';
  discountCard: 'BC25' | 'BC50' | 'none';
  price: number;
}

export interface PublicTransportPlanExpense extends BaseExpense {
  type: 'plan';
}

export type Expense =
  | BikeExpense
  | CarExpense
  | TrainExpense
  | PublicTransportPlanExpense;
