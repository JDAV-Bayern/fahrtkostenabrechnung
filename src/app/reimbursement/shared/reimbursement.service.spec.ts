import { TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';
import { SectionService } from 'src/app/core/section.service';
import { MaterialExpense, TransportExpense } from 'src/domain/expense.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { ExpenseConfig } from '../expenses/expense.config';
import { ExpenseConfigService } from '../expenses/shared/expense-config.service';
import { ExpenseService } from '../expenses/shared/expense.service';
import { ReimbursementService } from './reimbursement.service';

const BAVARIAN_SECTION = 1;
const OTHER_SECTION = 2;

const config: ExpenseConfig = {
  allowed: ['transport', 'material'],
  transport: {
    car: [0.3],
    public: { none: 1, BC25: 0.75, BC50: 0.5 },
    plan: 10,
    bike: 0.1,
  },
};

const car = (distance: number): TransportExpense => ({
  type: 'transport',
  mode: 'car',
  origin: 'A',
  destination: 'B',
  distance,
  carTrip: { engineType: 'combustion', passengers: [] },
});

const publicTransport = (price: number): TransportExpense => ({
  type: 'transport',
  mode: 'public',
  origin: 'A',
  destination: 'B',
  ticket: { discount: 'none', price },
});

const plan = (): TransportExpense => ({
  type: 'transport',
  mode: 'plan',
  origin: 'A',
  destination: 'B',
});

const material = (amount: number): MaterialExpense => ({
  type: 'material',
  date: new Date(2025, 0, 1),
  purpose: 'Material',
  amount,
});

const reimbursement = (
  overrides: {
    transport?: TransportExpense[];
    material?: MaterialExpense[];
    sectionId?: number;
  } = {},
): Reimbursement => ({
  meeting: { type: 'course', name: 'Kurs', code: 'B123FB' },
  participant: {
    givenName: 'Max',
    familyName: 'Mustermann',
    sectionId: overrides.sectionId ?? BAVARIAN_SECTION,
    zipCode: '80331',
    city: 'München',
    iban: 'DE02120300000000202051',
  },
  expenses: {
    transport: {
      inbound: overrides.transport ?? [],
      onsite: [],
      outbound: [],
    },
    food: [],
    material: overrides.material ?? [],
  },
  note: '',
});

describe('ReimbursementService', () => {
  let service: ReimbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ExpenseConfigService,
          useValue: { getConfig: () => NEVER },
        },
        {
          provide: SectionService,
          useValue: {
            getSection: (id: number) =>
              id === BAVARIAN_SECTION || id === OTHER_SECTION
                ? { id, jdavState: { id: id === BAVARIAN_SECTION ? 2 : 1 } }
                : undefined,
            isBavarian: (section: { jdavState: { id: number } }) =>
              section.jdavState.id === 2,
          },
        },
      ],
    });
    service = TestBed.inject(ReimbursementService);
  });

  function setConfig(value: ExpenseConfig) {
    service.config.set(value);
    TestBed.inject(ExpenseService).config.set(value);
  }

  describe('getFoodExpenses', () => {
    it('should return nothing for invalid dates', () => {
      expect(
        service.getFoodExpenses(
          { start: new Date(NaN), end: new Date(2025, 0, 1) },
          false,
        ),
      ).toEqual([]);
      expect(
        service.getFoodExpenses(
          { start: new Date(2025, 0, 1), end: new Date(NaN) },
          false,
        ),
      ).toEqual([]);
    });

    it('should return nothing for less than 8 hours', () => {
      const result = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 9), end: new Date(2025, 0, 1, 16, 59) },
        false,
      );
      expect(result).toEqual([]);
    });

    it('should return a single expense for exactly 8 hours', () => {
      const result = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 9), end: new Date(2025, 0, 1, 17) },
        false,
      );
      expect(result).toEqual([
        {
          type: 'food',
          date: new Date(2025, 0, 1),
          absence: 'single',
          breakfast: false,
          lunch: false,
          dinner: false,
        },
      ]);
    });

    it('should return a single expense on the longer day for two days without overnight stay', () => {
      // most of the time is on the first day
      const first = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 8), end: new Date(2025, 0, 2, 2) },
        false,
      );
      expect(first.map((e) => [e.date, e.absence])).toEqual([
        [new Date(2025, 0, 1), 'single'],
      ]);

      // most of the time is on the second day
      const second = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 20), end: new Date(2025, 0, 2, 10) },
        false,
      );
      expect(second.map((e) => [e.date, e.absence])).toEqual([
        [new Date(2025, 0, 2), 'single'],
      ]);
    });

    it('should return arrival and return for two days with overnight stay', () => {
      const result = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 20), end: new Date(2025, 0, 2, 10) },
        true,
      );
      expect(result.map((e) => [e.date, e.absence])).toEqual([
        [new Date(2025, 0, 1), 'arrival'],
        [new Date(2025, 0, 2), 'return'],
      ]);
    });

    it('should return arrival, intermediate and return days for multi-day meetings', () => {
      const result = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 12), end: new Date(2025, 0, 4, 12) },
        false,
      );
      expect(result.map((e) => e.absence)).toEqual([
        'arrival',
        'intermediate',
        'intermediate',
        'return',
      ]);
      expect(result.map((e) => e.date)).toEqual([
        new Date(2025, 0, 1),
        new Date(2025, 0, 2),
        new Date(2025, 0, 3),
        new Date(2025, 0, 4),
      ]);
    });

    it('should start with no meals selected', () => {
      const result = service.getFoodExpenses(
        { start: new Date(2025, 0, 1, 12), end: new Date(2025, 0, 3, 12) },
        false,
      );
      for (const expense of result) {
        expect(expense.breakfast).toBe(false);
        expect(expense.lunch).toBe(false);
        expect(expense.dinner).toBe(false);
      }
    });
  });

  describe('getExpenses', () => {
    it('should flatten transport expenses of all directions', () => {
      const r = reimbursement();
      r.expenses.transport.inbound = [car(1)];
      r.expenses.transport.onsite = [car(2)];
      r.expenses.transport.outbound = [car(3)];

      expect(service.getExpenses('transport', r)).toEqual([
        car(1),
        car(2),
        car(3),
      ]);
    });

    it('should return the expenses of other types as they are', () => {
      const r = reimbursement({ material: [material(5)] });
      expect(service.getExpenses('material', r)).toEqual([material(5)]);
      expect(service.getExpenses('food', r)).toEqual([]);
    });
  });

  describe('getReport', () => {
    it('should return an empty report without config', () => {
      expect(
        service.getReport(reimbursement({ transport: [car(100)] })),
      ).toEqual({
        categories: {},
        total: 0,
        totalReduced: false,
        receiptsRequired: false,
      });
    });

    it('should sum amounts per category and in total', () => {
      setConfig(config);
      const report = service.getReport(
        reimbursement({
          transport: [car(100), car(50)],
          material: [material(20)],
        }),
      );
      expect(report.categories.transport).toBeCloseTo(45);
      expect(report.categories.material).toBe(20);
      expect(report.total).toBeCloseTo(65);
      expect(report.totalReduced).toBe(false);
    });

    it('should only report allowed categories', () => {
      setConfig({ ...config, allowed: ['transport'] });
      const report = service.getReport(
        reimbursement({ transport: [car(10)], material: [material(20)] }),
      );
      expect(Object.keys(report.categories)).toEqual(['transport']);
      expect(report.total).toBeCloseTo(3);
    });

    describe('maximum total', () => {
      beforeEach(() => setConfig({ ...config, maxTotal: 100 }));

      it('should cap the total for non-Bavarian sections', () => {
        const report = service.getReport(
          reimbursement({
            material: [material(150)],
            sectionId: OTHER_SECTION,
          }),
        );
        expect(report.total).toBe(100);
        expect(report.totalReduced).toBe(true);
        expect(report.categories.material).toBe(150);
      });

      it('should not cap the total for Bavarian sections', () => {
        const report = service.getReport(
          reimbursement({
            material: [material(150)],
            sectionId: BAVARIAN_SECTION,
          }),
        );
        expect(report.total).toBe(150);
        expect(report.totalReduced).toBe(false);
      });

      it('should cap the total for unknown sections', () => {
        const report = service.getReport(
          reimbursement({ material: [material(150)], sectionId: 0 }),
        );
        expect(report.total).toBe(100);
        expect(report.totalReduced).toBe(true);
      });

      it('should not cap totals up to the maximum', () => {
        const report = service.getReport(
          reimbursement({
            material: [material(100)],
            sectionId: OTHER_SECTION,
          }),
        );
        expect(report.total).toBe(100);
        expect(report.totalReduced).toBe(false);
      });
    });

    describe('receipts', () => {
      beforeEach(() => setConfig(config));

      it('should not require receipts for car trips only', () => {
        expect(
          service.getReport(reimbursement({ transport: [car(10)] }))
            .receiptsRequired,
        ).toBe(false);
      });

      it('should require receipts for public transport', () => {
        expect(
          service.getReport(reimbursement({ transport: [publicTransport(20)] }))
            .receiptsRequired,
        ).toBe(true);
      });

      it('should require receipts for public transport plans', () => {
        expect(
          service.getReport(reimbursement({ transport: [plan()] }))
            .receiptsRequired,
        ).toBe(true);
      });

      it('should require receipts for material with an amount', () => {
        expect(
          service.getReport(reimbursement({ material: [material(5)] }))
            .receiptsRequired,
        ).toBe(true);
      });

      it('should not require receipts for material without an amount', () => {
        expect(
          service.getReport(reimbursement({ material: [material(0)] }))
            .receiptsRequired,
        ).toBe(false);
      });
    });
  });
});
