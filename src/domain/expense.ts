export type ExpenseType = 'bike' | 'car' | 'train' | 'plan';
export type Direction = 'from' | 'to' | 'at';

export interface IExpense {
  type: ExpenseType;
  id: number;
  totalReimbursement: () => number;
  startLocation: string;
  endLocation: string;
}

type OmitIdAndTotal<T> = Omit<T, 'id' | 'totalReimbursement'> & { id?: number };
type OmitIdTotalAndType<T> = Omit<T, 'id' | 'totalReimbursement' | 'type'> & {
  id?: number;
};

abstract class Expense implements IExpense {
  type: ExpenseType;
  id: number;
  startLocation: string;
  endLocation: string;

  constructor(data: OmitIdAndTotal<IExpense>) {
    this.type = data.type;
    this.id = data.id || randomId();
    this.startLocation = data.startLocation;
    this.endLocation = data.endLocation;
  }

  abstract totalReimbursement(): number;

  abstract serialize(): string;
}

export interface IBikeExpense extends IExpense {
  type: 'bike';
  distance: number;
}

export type IBikeExpenseData = OmitIdTotalAndType<IBikeExpense>;

export class BikeExpense extends Expense implements IBikeExpense {
  override type: 'bike' = 'bike';
  distance: number;

  constructor(data: IBikeExpenseData) {
    super({ ...data, type: 'bike' });
    this.distance = data.distance;
  }

  totalReimbursement() {
    return this.distance * 0.13;
  }
}

export interface ICarExpense extends IExpense {
  type: 'car';
  distance: number;
  carType: 'combustion' | 'electric' | 'plug-in-hybrid';
  passengers: string[];
}

export type ICarExpenseData = OmitIdTotalAndType<ICarExpense>;

export class CarExpense extends Expense implements ICarExpense {
  override type: 'car' = 'car';
  distance: number;
  carType: 'combustion' | 'electric' | 'plug-in-hybrid';
  passengers: string[];

  constructor(data: ICarExpenseData) {
    super({ ...data, type: 'car' });
    this.distance = data.distance;
    this.carType = data.carType;
    this.passengers = data.passengers;
  }

  totalReimbursement() {
    if (!this.passengers?.length) {
      return this.distance * 0.05;
    }
    switch (this.passengers.length) {
      case 1:
        return this.distance * 0.1;
      case 2:
        return this.distance * 0.15;
      case 3:
        return this.distance * 0.2;
      case 4:
        return this.distance * 0.25;
      default:
        return this.distance * 0.3;
    }
  }
}

export interface ITrainExpense extends IExpense {
  type: 'train';
  discountCard: 'BC25' | 'BC50' | 'none';
  priceWithDiscount: number;
}

export type ITrainExpenseData = OmitIdTotalAndType<ITrainExpense>;

export class TrainExpense extends Expense implements ITrainExpense {
  override type: 'train' = 'train';
  discountCard: 'BC25' | 'BC50' | 'none';
  priceWithDiscount: number;

  constructor(data: ITrainExpenseData) {
    super({ ...data, type: 'train' });
    this.discountCard = data.discountCard;
    this.priceWithDiscount = data.priceWithDiscount;
  }

  totalReimbursement() {
    switch (this.discountCard) {
      case 'BC25':
        return this.priceWithDiscount * 1.05;
      case 'BC50':
        return this.priceWithDiscount * 1.1;
      case 'none':
        return this.priceWithDiscount;
    }
  }
}

export interface IPublicTransportPlanExpense extends IExpense {
  type: 'plan';
}

export type IPublicTransportPlanExpenseData =
  OmitIdTotalAndType<IPublicTransportPlanExpense>;

export class PublicTransportPlanExpense
  extends Expense
  implements IPublicTransportPlanExpense
{
  override type: 'plan' = 'plan';

  constructor(data: IPublicTransportPlanExpenseData) {
    super({ ...data, type: 'plan' });
  }

  totalReimbursement() {
    return 12.25;
  }
}

function randomId(): number {
  return Math.floor(Math.random() * 100000000000000);
}

export function mapTripToReturn(expense: IExpense): IExpense {
  switch (expense.type) {
    case 'car':
      const carExpense = expense as ICarExpense;
      return new CarExpense({
        ...carExpense,
        id: randomId(),
        startLocation: carExpense.endLocation,
        endLocation: carExpense.startLocation
      });
    case 'bike':
      const bikeExpense = expense as IBikeExpense;
      return new BikeExpense({
        ...bikeExpense,
        id: randomId(),
        startLocation: bikeExpense.endLocation,
        endLocation: bikeExpense.startLocation
      });
    case 'train':
      const trainExpense = expense as ITrainExpense;
      return new TrainExpense({
        ...trainExpense,
        id: randomId(),
        startLocation: trainExpense.endLocation,
        endLocation: trainExpense.startLocation
      });
    case 'plan':
      const planExpense = expense as IPublicTransportPlanExpense;
      return new PublicTransportPlanExpense({
        ...planExpense,
        id: randomId(),
        startLocation: planExpense.endLocation,
        endLocation: planExpense.startLocation
      });
  }
  return {
    ...expense,
    id: randomId(),
    startLocation: expense.endLocation,
    endLocation: expense.startLocation
  };
}
export function getDomainObjectFromSerializedData(serialized: any): IExpense {
  const type = serialized.type as ExpenseType;
  switch (type) {
    case 'car':
      return new CarExpense(serialized);
    case 'bike':
      return new BikeExpense(serialized);
    case 'train':
      return new TrainExpense(serialized);
    case 'plan':
      return new PublicTransportPlanExpense(serialized);
  }
}
