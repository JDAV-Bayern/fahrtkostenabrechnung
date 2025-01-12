export type Direction = 'inbound' | 'onsite' | 'outbound';
export type Discount = 'BC25' | 'BC50' | 'none';
export type EngineType = 'combustion' | 'electric' | 'plug-in-hybrid';
export type Absence = 'arrival' | 'return' | 'intermediate' | 'single';
export type Meal = 'breakfast' | 'lunch' | 'dinner';

export interface TransportExpenseBase {
  type: 'transport';
  mode: string;
  origin: string;
  destination: string;
}

export interface BikeExpense extends TransportExpenseBase {
  mode: 'bike';
  distance: number;
}

export interface CarExpense extends TransportExpenseBase {
  mode: 'car';
  distance: number;
  carTrip: {
    engineType: EngineType;
    passengers: string[];
  };
}

export interface PublicTransportExpense extends TransportExpenseBase {
  mode: 'public';
  ticket: {
    discount: Discount;
    price: number;
  };
}

export interface PublicTransportPlanExpense extends TransportExpenseBase {
  mode: 'plan';
}

export interface FoodExpense {
  type: 'food';
  date: Date;
  absence: Absence;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface MaterialExpense {
  type: 'material';
  date: Date;
  purpose: string;
  amount: number;
}

export type TransportExpense =
  | BikeExpense
  | CarExpense
  | PublicTransportExpense
  | PublicTransportPlanExpense;
export type TransportMode = TransportExpense['mode'];

export type Expense = TransportExpense | FoodExpense | MaterialExpense;
export type ExpenseType = Expense['type'];
