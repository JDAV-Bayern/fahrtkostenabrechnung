import { TransportExpense } from 'src/domain/expense.model';
import {
  buildMaterialExpense,
  buildTransportExpense,
  draftFromMaterialExpense,
  draftFromTransportExpense,
  emptyMaterialDraft,
  emptyTransportDraft,
  TransportExpenseDraft,
} from './expense-draft';

const draft = (
  overrides: Partial<TransportExpenseDraft>,
): TransportExpenseDraft => ({
  ...emptyTransportDraft(),
  origin: 'München',
  destination: 'Berlin',
  ...overrides,
});

describe('buildTransportExpense', () => {
  it('should build a car expense without ticket data', () => {
    expect(
      buildTransportExpense(
        draft({
          mode: 'car',
          distance: 120,
          carTrip: { engineType: 'electric', passengers: ['Max'] },
          ticket: { price: 50, discount: 'BC25' },
        }),
      ),
    ).toEqual({
      type: 'transport',
      mode: 'car',
      origin: 'München',
      destination: 'Berlin',
      distance: 120,
      carTrip: { engineType: 'electric', passengers: ['Max'] },
    });
  });

  it('should build a public transport expense without distance and car data', () => {
    expect(
      buildTransportExpense(
        draft({
          mode: 'public',
          distance: 120,
          ticket: { price: 50, discount: 'BC25' },
        }),
      ),
    ).toEqual({
      type: 'transport',
      mode: 'public',
      origin: 'München',
      destination: 'Berlin',
      ticket: { price: 50, discount: 'BC25' },
    });
  });

  it('should build a bike expense with the distance only', () => {
    expect(buildTransportExpense(draft({ mode: 'bike', distance: 8 }))).toEqual(
      {
        type: 'transport',
        mode: 'bike',
        origin: 'München',
        destination: 'Berlin',
        distance: 8,
      },
    );
  });

  it('should build a plan expense without any details', () => {
    expect(buildTransportExpense(draft({ mode: 'plan', distance: 8 }))).toEqual(
      {
        type: 'transport',
        mode: 'plan',
        origin: 'München',
        destination: 'Berlin',
      },
    );
  });

  it('should treat missing numbers as 0', () => {
    expect(
      buildTransportExpense(draft({ mode: 'bike', distance: null })),
    ).toMatchObject({ distance: 0 });
    expect(
      buildTransportExpense(
        draft({ mode: 'public', ticket: { price: null, discount: 'none' } }),
      ),
    ).toMatchObject({ ticket: { price: 0 } });
  });

  it('should not share the passenger list with the draft', () => {
    const source = draft({
      mode: 'car',
      carTrip: { engineType: 'combustion', passengers: ['Max'] },
    });
    const expense = buildTransportExpense(source);
    source.carTrip.passengers.push('Erika');
    expect(expense).toMatchObject({ carTrip: { passengers: ['Max'] } });
  });

  it('should require a mode', () => {
    expect(() => buildTransportExpense(draft({ mode: null }))).toThrow();
  });
});

describe('draftFromTransportExpense', () => {
  const expenses: TransportExpense[] = [
    {
      type: 'transport',
      mode: 'car',
      origin: 'A',
      destination: 'B',
      distance: 10,
      carTrip: { engineType: 'plug-in-hybrid', passengers: ['Max', 'Erika'] },
    },
    {
      type: 'transport',
      mode: 'public',
      origin: 'A',
      destination: 'B',
      ticket: { price: 25, discount: 'BC50' },
    },
    {
      type: 'transport',
      mode: 'bike',
      origin: 'A',
      destination: 'B',
      distance: 5,
    },
    { type: 'transport', mode: 'plan', origin: 'A', destination: 'B' },
  ];

  it.each(expenses)('should round-trip a $mode expense', (expense) => {
    expect(buildTransportExpense(draftFromTransportExpense(expense))).toEqual(
      expense,
    );
  });

  it('should use defaults for the fields of other modes', () => {
    const result = draftFromTransportExpense(expenses[3]);
    expect(result.distance).toBe(0);
    expect(result.carTrip).toEqual({
      engineType: 'combustion',
      passengers: [],
    });
    expect(result.ticket).toEqual({ price: 0, discount: 'none' });
  });
});

describe('material expense drafts', () => {
  it('should round-trip an expense', () => {
    const expense = {
      type: 'material' as const,
      date: new Date(2025, 0, 1),
      purpose: 'Parkgebühr',
      amount: 12.5,
    };
    expect(buildMaterialExpense(draftFromMaterialExpense(expense))).toEqual(
      expense,
    );
  });

  it('should use an invalid date and 0 for missing values', () => {
    const expense = buildMaterialExpense({
      ...emptyMaterialDraft(),
      amount: null,
    });
    expect(Number.isNaN(expense.date.getTime())).toBe(true);
    expect(expense.amount).toBe(0);
  });
});
