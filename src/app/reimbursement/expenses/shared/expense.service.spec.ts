import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import {
  BikeExpense,
  CarExpense,
  FoodExpense,
  MaterialExpense,
  PublicTransportExpense,
  PublicTransportPlanExpense,
} from 'src/domain/expense.model';
import { ExpenseConfig } from '../expense.config';
import { ExpenseConfigService } from './expense-config.service';
import { ExpenseService } from './expense.service';

const config: ExpenseConfig = {
  allowed: ['transport', 'food', 'material'],
  transport: {
    car: [0.3, 0.35, 0.4],
    public: { none: 1, BC25: 0.75, BC50: 0.5 },
    plan: 10,
    bike: 0.1,
  },
  food: { arrival: 14, return: 14, intermediate: 28, single: 14 },
};

const base = { origin: 'A', destination: 'B' };

const car = (passengers: string[], distance = 100): CarExpense => ({
  type: 'transport',
  mode: 'car',
  ...base,
  distance,
  carTrip: { engineType: 'combustion', passengers },
});

const food = (overrides: Partial<FoodExpense> = {}): FoodExpense => ({
  type: 'food',
  date: new Date(2025, 0, 1),
  absence: 'intermediate',
  breakfast: false,
  lunch: false,
  dinner: false,
  ...overrides,
});

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ExpenseConfigService,
          useValue: { getConfig: () => NEVER },
        },
      ],
    });
    service = TestBed.inject(ExpenseService);
    service.config.set(config);
  });

  it('should return 0 without a config', () => {
    service.config.set(undefined);
    expect(service.getAmount(car([]))).toBe(0);
  });

  it('should return 0 for expense types that are not allowed', () => {
    service.config.set({ ...config, allowed: ['transport'] });
    const material: MaterialExpense = {
      type: 'material',
      date: new Date(),
      purpose: 'x',
      amount: 12,
    };
    expect(service.getAmount(material)).toBe(0);
    expect(service.getAmount(food())).toBe(0);
  });

  describe('car', () => {
    it('should use the rate for the number of passengers', () => {
      expect(service.getAmount(car([]))).toBeCloseTo(30);
      expect(service.getAmount(car(['a']))).toBeCloseTo(35);
      expect(service.getAmount(car(['a', 'b']))).toBeCloseTo(40);
    });

    it('should cap the rate at the highest configured passenger count', () => {
      expect(service.getAmount(car(['a', 'b', 'c', 'd']))).toBeCloseTo(40);
    });

    it('should return 0 without transport config', () => {
      service.config.set({ ...config, transport: undefined });
      expect(service.getAmount(car([]))).toBe(0);
    });
  });

  describe('public transport', () => {
    const ticket = (
      discount: PublicTransportExpense['ticket']['discount'],
    ): PublicTransportExpense => ({
      type: 'transport',
      mode: 'public',
      ...base,
      ticket: { discount, price: 80 },
    });

    it('should apply the discount factor to the ticket price', () => {
      expect(service.getAmount(ticket('none'))).toBe(80);
      expect(service.getAmount(ticket('BC25'))).toBe(60);
      expect(service.getAmount(ticket('BC50'))).toBe(40);
    });
  });

  it('should multiply bike distance by the bike rate', () => {
    const bike: BikeExpense = {
      type: 'transport',
      mode: 'bike',
      ...base,
      distance: 50,
    };
    expect(service.getAmount(bike)).toBeCloseTo(5);
  });

  it('should return the flat amount for a public transport plan', () => {
    const plan: PublicTransportPlanExpense = {
      type: 'transport',
      mode: 'plan',
      ...base,
    };
    expect(service.getAmount(plan)).toBe(10);
  });

  describe('food', () => {
    it('should return the full amount for the absence type', () => {
      expect(service.getAmount(food({ absence: 'arrival' }))).toBe(14);
      expect(service.getAmount(food({ absence: 'return' }))).toBe(14);
      expect(service.getAmount(food({ absence: 'single' }))).toBe(14);
      expect(service.getAmount(food({ absence: 'intermediate' }))).toBe(28);
    });

    it('should deduct 20% for breakfast and 40% for lunch and dinner', () => {
      expect(service.getAmount(food({ breakfast: true }))).toBeCloseTo(22.4);
      expect(service.getAmount(food({ lunch: true }))).toBeCloseTo(16.8);
      expect(service.getAmount(food({ dinner: true }))).toBeCloseTo(16.8);
      expect(
        service.getAmount(food({ breakfast: true, lunch: true, dinner: true })),
      ).toBeCloseTo(0);
    });

    it('should never return a negative amount', () => {
      expect(
        service.getAmount(
          food({
            absence: 'arrival',
            breakfast: true,
            lunch: true,
            dinner: true,
          }),
        ),
      ).toBe(0);
    });

    it('should return 0 without food config', () => {
      service.config.set({ ...config, food: undefined });
      expect(service.getAmount(food())).toBe(0);
    });
  });

  it('should return the entered amount for material expenses', () => {
    const material: MaterialExpense = {
      type: 'material',
      date: new Date(),
      purpose: 'Seil',
      amount: 23.5,
    };
    expect(service.getAmount(material)).toBe(23.5);
  });
});
