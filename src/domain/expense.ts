export interface IExpense {
    type: 'bike' | 'car' | 'train' | 'plan';
    id: string;
    totalReimbursement: () => number;
    position: number;
    direction: 'to' | 'from' | 'at';
}

export interface IBikeExpense extends IExpense {
    type: 'bike';
    distance: number;
    reimbursementPerKm: 0.13;
    direction: 'to' | 'from';
}

export interface ICarExpense extends IExpense {
    type: 'car';
    distance: number;
    carType: 'combustion' | 'electric' | 'plug-in-hybrid';
    startLocation: string;
    endLocation: string;
    passengers: string[];
}

export interface ITrainExpense extends IExpense {
    type: 'train';
    discountCard: 'BC25' | 'BC50';
    priceWithDiscount: number;
    direction: 'to' | 'from';
    startLocation: string;
    endLoction: string;
}

export interface IPublicTransportPlanExpense extends IExpense {
    type: 'plan';
    price: number;
    direction: 'to' | 'from';
}

export function mockCarExpense(): ICarExpense {
    const expense: ICarExpense = {
        type: "car",
        distance: Math.floor(Math.random() * 200),
        carType: pick('combustion', 'electric', 'plug-in-hybrid'),
        startLocation: "Stardt",
        endLocation: "Zielty",
        passengers: ['Alex'],
        id: Math.random().toFixed(8),
        totalReimbursement: function (): number {
            return this.distance * 0.1;
        },
        position: 0,
        direction: pick('from', 'to')
    }
    return expense;
}

function pick<T>(...array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}