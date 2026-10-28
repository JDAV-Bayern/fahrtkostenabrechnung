import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { JoinPipe } from 'src/app/shared/join.pipe';
import { Expense, FoodExpense, TransportMode } from 'src/domain/expense.model';
import { DirectionPipe } from '../../shared/direction.pipe';
import { ExpenseAmountPipe } from './expense-amount.pipe';
import { ExpenseConfigService } from './expense-config.service';
import {
  AbsencePipe,
  DiscountPipe,
  EngineTypePipe,
  MealsPipe,
} from './expense-data.pipe';
import { ExpenseTitlePipe } from './expense-title.pipe';
import { ExpenseTypePipe } from './expense-type.pipe';
import { ExpenseService } from './expense.service';
import { TransportModePipe } from './transport-mode.pipe';

describe('DiscountPipe', () => {
  const pipe = new DiscountPipe();

  it.each([
    ['none', 'Keine BahnCard'],
    ['BC25', 'BahnCard 25'],
    ['BC50', 'BahnCard 50'],
  ])('should format %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  it('should return null for unknown values', () => {
    expect(pipe.transform('BC100')).toBeNull();
  });
});

describe('EngineTypePipe', () => {
  const pipe = new EngineTypePipe();

  it.each([
    ['combustion', 'Verbrenner'],
    ['electric', 'Elektro'],
    ['plug-in-hybrid', 'Plug-In Hybrid'],
  ])('should format %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  it('should return null for unknown values', () => {
    expect(pipe.transform('steam')).toBeNull();
  });
});

describe('AbsencePipe', () => {
  const pipe = new AbsencePipe();

  it.each([
    ['arrival', 'Anreisetag'],
    ['return', 'Rückreisetag'],
    ['intermediate', 'Zwischentag'],
    ['single', 'Abwesenheit von mehr als 8 Stunden'],
  ])('should format %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  it('should return null for unknown and empty values', () => {
    expect(pipe.transform('other')).toBeNull();
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});

describe('MealsPipe', () => {
  const pipe = new MealsPipe();
  const food = (overrides: Partial<FoodExpense>): FoodExpense => ({
    type: 'food',
    date: new Date(),
    absence: 'single',
    breakfast: false,
    lunch: false,
    dinner: false,
    ...overrides,
  });

  it('should return no meals when none is selected', () => {
    expect(pipe.transform(food({}))).toEqual([]);
  });

  it('should list selected meals in order', () => {
    expect(
      pipe.transform(food({ breakfast: true, lunch: true, dinner: true })),
    ).toEqual(['Frühstück', 'Mittag', 'Abend']);
    expect(pipe.transform(food({ dinner: true, breakfast: true }))).toEqual([
      'Frühstück',
      'Abend',
    ]);
  });
});

describe('ExpenseTypePipe', () => {
  const pipe = new ExpenseTypePipe();

  it.each([
    ['transport', 'Fahrtkosten'],
    ['food', 'Tagegeld'],
    ['material', 'Sachkosten'],
  ])('should format %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  it('should return null for unknown values', () => {
    expect(pipe.transform('other')).toBeNull();
  });
});

describe('TransportModePipe', () => {
  const pipe = new TransportModePipe();

  it.each<[TransportMode, string]>([
    ['car', 'Autofahrt'],
    ['public', 'Fahrt mit ÖPNV'],
    ['plan', 'Fahrt mit ÖPNV-Abo'],
    ['bike', 'Fahrradfahrt'],
  ])('should format %s', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });
});

describe('DirectionPipe', () => {
  const pipe = new DirectionPipe();

  it('should format all directions', () => {
    expect(pipe.transform('inbound')).toBe('Hinfahrt');
    expect(pipe.transform('onsite')).toBe('Vor Ort');
    expect(pipe.transform('outbound')).toBe('Rückfahrt');
  });
});

describe('ExpenseTitlePipe', () => {
  const pipe = new ExpenseTitlePipe();

  it('should use the transport mode for transport expenses', () => {
    expect(
      pipe.transform({
        type: 'transport',
        mode: 'bike',
        origin: 'A',
        destination: 'B',
        distance: 1,
      }),
    ).toBe('Fahrradfahrt');
  });

  it('should use the absence for food expenses', () => {
    expect(
      pipe.transform({
        type: 'food',
        date: new Date(),
        absence: 'arrival',
        breakfast: false,
        lunch: false,
        dinner: false,
      }),
    ).toBe('Abwesenheit Anreisetag');
  });

  it('should use the purpose for material expenses', () => {
    expect(
      pipe.transform({
        type: 'material',
        date: new Date(),
        purpose: 'Seil',
        amount: 5,
      }),
    ).toBe('Seil');
  });
});

describe('JoinPipe', () => {
  const pipe = new JoinPipe();

  it('should join values with a comma', () => {
    expect(pipe.transform(['a', 'b', 'c'])).toBe('a, b, c');
    expect(pipe.transform([1, 2])).toBe('1, 2');
  });

  it('should return an empty string for empty lists', () => {
    expect(pipe.transform([])).toBe('');
  });

  it('should return null for null and undefined', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform(undefined)).toBeNull();
  });
});

describe('ExpenseAmountPipe', () => {
  it('should delegate to the expense service', () => {
    const getAmount = vi.fn(() => 42);
    TestBed.configureTestingModule({
      providers: [
        { provide: ExpenseConfigService, useValue: { getConfig: () => NEVER } },
      ],
    });
    const service = TestBed.inject(ExpenseService);
    service.getAmount = getAmount;

    const expense: Expense = {
      type: 'material',
      date: new Date(),
      purpose: 'x',
      amount: 1,
    };
    const result = TestBed.runInInjectionContext(() =>
      new ExpenseAmountPipe().transform(expense),
    );

    expect(result).toBe(42);
    expect(getAmount).toHaveBeenCalledWith(expense);
  });
});
