import { TestBed } from '@angular/core/testing';
import { PlzService } from 'src/app/core/plz.service';
import { TransportExpense } from 'src/domain/expense.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { ReimbursementValidatorService } from './reimbursement-validator.service';

const trip = (origin: string, destination: string): TransportExpense => ({
  type: 'transport',
  mode: 'plan',
  origin,
  destination,
});

const reimbursement = (
  inbound: TransportExpense[] = [],
  outbound: TransportExpense[] = [],
): Reimbursement => ({
  meeting: { type: 'course', name: 'Kurs', code: 'B123FB' },
  participant: {
    givenName: 'Max',
    familyName: 'Mustermann',
    sectionId: 1,
    zipCode: '80331',
    city: 'München',
    iban: 'DE02120300000000202051',
  },
  expenses: {
    transport: { inbound, onsite: [], outbound },
    food: [],
    material: [],
  },
  note: '',
});

describe('ReimbursementValidatorService', () => {
  let service: ReimbursementValidatorService;
  let plzExists: boolean;

  beforeEach(() => {
    plzExists = true;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PlzService,
          useValue: { exists: () => plzExists },
        },
      ],
    });
    service = TestBed.inject(ReimbursementValidatorService);
  });

  it('should have no findings for a valid reimbursement', () => {
    const findings = service.validateReimbursement(
      reimbursement(
        [trip('München', 'Salzburg'), trip('Salzburg', 'Kurshaus')],
        [trip('Kurshaus', 'München')],
      ),
    );
    expect(findings).toEqual([]);
  });

  it('should have no findings without any transport expenses', () => {
    expect(service.validateReimbursement(reimbursement())).toEqual([]);
  });

  it('should have no findings for a single transport expense', () => {
    expect(
      service.validateReimbursement(reimbursement([trip('A', 'B')])),
    ).toEqual([]);
  });

  it('should report an unknown place of residence', () => {
    plzExists = false;
    const findings = service.validateReimbursement(reimbursement());
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain('80331 München');
  });

  it('should report a gap in the route', () => {
    const findings = service.validateReimbursement(
      reimbursement([trip('A', 'B'), trip('C', 'D')]),
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain('von B nach C');
  });

  it('should report a gap between inbound and outbound trips', () => {
    const findings = service.validateReimbursement(
      reimbursement([trip('A', 'B')], [trip('C', 'A')]),
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain('von B nach C');
  });

  it('should report every gap', () => {
    const findings = service.validateReimbursement(
      reimbursement([trip('A', 'B'), trip('C', 'D'), trip('E', 'F')]),
    );
    expect(findings).toHaveLength(2);
    expect(findings[0]).toContain('von B nach C');
    expect(findings[1]).toContain('von D nach E');
  });

  it('should combine findings for residence and route', () => {
    plzExists = false;
    const findings = service.validateReimbursement(
      reimbursement([trip('A', 'B'), trip('C', 'D')]),
    );
    expect(findings).toHaveLength(2);
  });
});
