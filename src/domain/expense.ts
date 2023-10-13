export interface IExpense {
    id: string;
    totalReimbursement: () => number;
    position: number;
    direction: 'to' | 'from' | 'at';
}

export interface IBikeExpense extends IExpense {
    distance: number;
    reimbursementPerKm: 0.13;
    direction: 'to' | 'from';
}

export interface ICarExpense extends IExpense {
    distance: number;
    carType: 'combustion' | 'electric' | 'plug-in-hybrid';
    startLocation: string;
    endLocation: string;
    passengers: string[];
}

export interface ITrainExpense extends IExpense {
    discountCard: 'BC25' | 'BC50';
    priceWithDiscount: number;
    direction: 'to' | 'from';
    startLocation: string;
    endLoction: string;
}

export interface IPublicTransportPlanExpense extends IExpense {
    price: number;
    direction: 'to' | 'from';
}