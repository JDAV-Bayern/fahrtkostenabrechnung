export type Direction = 'inbound' | 'onsite' | 'outbound';
export type DiscountCard = 'BC25' | 'BC50' | 'none';
export type CarType = 'combustion' | 'electric' | 'plug-in-hybrid';
export type Absence = 'fullDay' | 'travelDay' | 'workDay';
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
  carType: CarType;
  passengers: string[];
}

export interface TrainExpense extends TransportExpenseBase {
  mode: 'train';
  discountCard: DiscountCard;
  price: number;
}

export interface PublicTransportPlanExpense extends TransportExpenseBase {
  mode: 'plan';
}

export interface FoodExpense {
  type: 'food';
  date: Date;
  absence: Absence;
  meals: Meal[];
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
  | TrainExpense
  | PublicTransportPlanExpense;
export type TransportMode = TransportExpense['mode'];

export type Expense = TransportExpense | FoodExpense | MaterialExpense;
export type ExpenseType = Expense['type'];
