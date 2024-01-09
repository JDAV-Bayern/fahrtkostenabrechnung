export type ExpenseType = 'bike' | 'car' | 'train' | 'plan';
export type Direction = 'from' | 'to' | 'at';

export interface IExpense {
    type: ExpenseType;
    id: number;
    totalReimbursement: () => number;
    direction: Direction
    startLocation: string;
    endLocation: string;
    serialize: () => string;
}

type OmitIdAndTotal<T> = Omit<T, 'id' | 'totalReimbursement' | 'serialize' | 'deserialize'> & { id?: number };
type OmitIdTotalAndType<T> = Omit<T, 'id' | 'totalReimbursement' | 'type' | 'serialize'> & { id?: number };
type WithTypeAndId<T> = T & { id: number, type: ExpenseType };

class Expense implements OmitIdAndTotal<IExpense>{
    type: ExpenseType;
    id: number;
    direction: Direction;
    startLocation: string;
    endLocation: string;

    constructor(data: OmitIdAndTotal<IExpense>) {
        this.type = data.type;
        this.direction = data.direction;
        this.id = data.id || randomId();
        this.startLocation = data.startLocation;
        this.endLocation = data.endLocation;
    }

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
    serialize() {
        const dataWithId: WithTypeAndId<IBikeExpenseData> = {
            id: this.id,
            type: this.type,
            direction: this.direction,
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            distance: this.distance
        };
        return JSON.stringify(dataWithId);
    };
    static deserialize(serialized: string) {
        const data: WithTypeAndId<IBikeExpenseData> = JSON.parse(serialized);
        return new BikeExpense(data);
    };
}

export interface ICarExpense extends IExpense {
    type: 'car';
    distance: number;
    carType: 'combustion' | 'electric' | 'plug-in-hybrid';
    passengers: string[];
}

export type ICarExpenseData = OmitIdTotalAndType<ICarExpense>;

export class CarExpense extends Expense implements ICarExpense {
    override type: "car" = 'car';
    distance: number;
    carType: "combustion" | "electric" | "plug-in-hybrid";
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
                return this.distance * 0.30;
        }
    }
    serialize() {
        const dataWithId: WithTypeAndId<ICarExpenseData> = {
            id: this.id,
            type: this.type,
            direction: this.direction,
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            distance: this.distance,
            carType: this.carType,
            passengers: this.passengers
        };
        return JSON.stringify(dataWithId);
    }
    static deserialize(serialized: string) {
        const data: WithTypeAndId<ICarExpenseData> = JSON.parse(serialized);
        return new CarExpense(data);
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
    discountCard: "BC25" | "BC50" | "none";
    priceWithDiscount: number;

    constructor(data: ITrainExpenseData) {
        super({ ...data, type: 'train' });
        this.discountCard = data.discountCard;
        this.priceWithDiscount = data.priceWithDiscount;
    }

    totalReimbursement() {
        switch (this.discountCard) {
            case "BC25":
                return this.priceWithDiscount * 1.05;
            case "BC50":
                return this.priceWithDiscount * 1.1;
            case "none":
                return this.priceWithDiscount;
        }
    }

    serialize() {
        const dataWithId: WithTypeAndId<ITrainExpenseData> = {
            id: this.id,
            type: this.type,
            direction: this.direction,
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            discountCard: this.discountCard,
            priceWithDiscount: this.priceWithDiscount
        };
        return JSON.stringify(dataWithId);
    }
    static deserialize(serialized: string) {
        const data: WithTypeAndId<ITrainExpenseData> = JSON.parse(serialized);
        return new TrainExpense(data);
    }

}

export interface IPublicTransportPlanExpense extends IExpense {
    type: 'plan';
    price: number;
}

export type IPublicTransportPlanExpenseData = OmitIdTotalAndType<IPublicTransportPlanExpense>;

export class PublicTransportPlanExpense extends Expense implements IPublicTransportPlanExpense {
    override type: 'plan' = 'plan';
    price: number;

    constructor(data: IPublicTransportPlanExpenseData) {
        super({ ...data, type: 'plan' });
        this.price = data.price;
    }
    totalReimbursement() {
        return this.price * 0.25;
    };
    serialize() {
        const dataWithId: WithTypeAndId<IPublicTransportPlanExpenseData> = {
            id: this.id,
            type: this.type,
            direction: this.direction,
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            price: this.price
        };
        return JSON.stringify(dataWithId);
    }

    static deserialize(serialized: string) {
        const data: WithTypeAndId<IPublicTransportPlanExpenseData> = JSON.parse(serialized);
        return new PublicTransportPlanExpense(data);
    }
}

export function mockCarExpense(): ICarExpense {
    const expense: ICarExpense = {
        type: "car",
        distance: Math.floor(Math.random() * 200),
        carType: pick('combustion', 'electric', 'plug-in-hybrid'),
        startLocation: "Stardt",
        endLocation: "Zielty",
        passengers: ['Alex'],
        id: randomId(),
        totalReimbursement: function (): number {
            return this.distance * 0.1;
        },
        direction: pick('from', 'to', 'at'),
        serialize() {
            const dataWithId: WithTypeAndId<ICarExpenseData> = {
                id: this.id,
                type: this.type,
                direction: this.direction,
                startLocation: this.startLocation,
                endLocation: this.endLocation,
                distance: this.distance,
                carType: this.carType,
                passengers: this.passengers
            };
            return JSON.stringify(dataWithId);
        }
    }
    return expense;
}

function randomId(): number {
    return Math.floor(Math.random() * 100000000000000);
}

function pick<T>(...array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function mapTripToReturn(expense: IExpense): IExpense {
    switch (expense.type) {
        case 'car':
            const carExpense = expense as ICarExpense;
            return new CarExpense({
                ...carExpense,
                id: randomId(),
                direction: carExpense.direction === 'from' ? 'to' : 'from',
                startLocation: carExpense.endLocation,
                endLocation: carExpense.startLocation
            });
        case 'bike':
            const bikeExpense = expense as IBikeExpense;
            return new BikeExpense({
                ...bikeExpense,
                id: randomId(),
                direction: bikeExpense.direction === 'from' ? 'to' : 'from',
                startLocation: bikeExpense.endLocation,
                endLocation: bikeExpense.startLocation
            });
        case 'train':
            const trainExpense = expense as ITrainExpense;
            return new TrainExpense({
                ...trainExpense,
                id: randomId(),
                direction: trainExpense.direction === 'from' ? 'to' : 'from',
                startLocation: trainExpense.endLocation,
                endLocation: trainExpense.startLocation
            });
        case 'plan':
            const planExpense = expense as IPublicTransportPlanExpense;
            return new PublicTransportPlanExpense({
                ...planExpense,
                id: randomId(),
                direction: planExpense.direction === 'from' ? 'to' : 'from',
                startLocation: planExpense.endLocation,
                endLocation: planExpense.startLocation
            });
    }
    return { ...expense, id: randomId(), startLocation: expense.endLocation, endLocation: expense.startLocation };
}
export function getDomainObjectFromSerializedData(serialized: string): IExpense {
    const type = JSON.parse(serialized).type as ExpenseType;
    switch (type) {
        case 'car':
            return CarExpense.deserialize(serialized);
        case 'bike':
            return BikeExpense.deserialize(serialized);
        case 'train':
            return TrainExpense.deserialize(serialized)
        case 'plan':
            return PublicTransportPlanExpense.deserialize(serialized);
    }
}