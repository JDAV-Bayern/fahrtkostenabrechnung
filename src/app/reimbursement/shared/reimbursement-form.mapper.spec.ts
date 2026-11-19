import { FoodExpense, MaterialExpense } from 'src/domain/expense.model';
import { toMeeting, toReimbursement } from './reimbursement-form.mapper';
import { initialFormModel } from './reimbursement-form.model';

const food: FoodExpense = {
  type: 'food',
  date: new Date(2025, 0, 1),
  absence: 'single',
  breakfast: false,
  lunch: false,
  dinner: false,
};

describe('toMeeting', () => {
  it('should return the course data only', () => {
    const model = initialFormModel();
    model.meeting = {
      ...model.meeting,
      name: 'Kurs',
      code: 'B123FB',
      location: 'ignored',
    };

    const meeting = toMeeting(model.meeting);
    expect(meeting).toEqual({ type: 'course', name: 'Kurs', code: 'B123FB' });
    expect(Object.keys(meeting)).toEqual(['type', 'name', 'code']);
  });

  it('should return the committee data only', () => {
    const start = new Date(2025, 0, 1, 10);
    const end = new Date(2025, 0, 1, 20);
    const model = initialFormModel();
    model.meeting = {
      type: 'committee',
      name: 'Sitzung',
      location: 'Bamberg',
      time: { start, end },
      code: 'ignored',
    };

    const meeting = toMeeting(model.meeting);
    expect(meeting).toEqual({
      type: 'committee',
      name: 'Sitzung',
      location: 'Bamberg',
      time: { start, end },
    });
    expect(Object.keys(meeting)).toEqual(['type', 'name', 'location', 'time']);
  });

  it('should return invalid dates for incomplete committee times', () => {
    const model = initialFormModel();
    model.meeting.type = 'committee';

    const meeting = toMeeting(model.meeting);
    if (meeting.type !== 'committee') {
      throw new Error('expected committee');
    }
    expect(Number.isNaN(meeting.time.start.getTime())).toBe(true);
    expect(Number.isNaN(meeting.time.end.getTime())).toBe(true);
  });
});

describe('toReimbursement', () => {
  it('should use 0 for a missing section', () => {
    expect(
      toReimbursement(initialFormModel(), false).participant.sectionId,
    ).toBe(0);
  });

  it('should return the participant, including the BIC', () => {
    const model = initialFormModel();
    model.participant = {
      ...model.participant,
      givenName: 'Max',
      sectionId: 1002,
      bic: 'UBSWCHZH80A',
    };

    expect(toReimbursement(model, false).participant).toMatchObject({
      givenName: 'Max',
      sectionId: 1002,
      bic: 'UBSWCHZH80A',
    });
  });

  it('should keep the key order of the participant', () => {
    expect(
      Object.keys(toReimbursement(initialFormModel(), false).participant),
    ).toEqual([
      'givenName',
      'familyName',
      'sectionId',
      'zipCode',
      'city',
      'iban',
      'bic',
    ]);
  });

  it('should include transport expenses of all directions', () => {
    const model = initialFormModel();
    const expense = {
      type: 'transport',
      mode: 'plan',
      origin: 'A',
      destination: 'B',
    } as const;
    model.expenses.transport.inbound = [expense];
    model.expenses.transport.outbound = [expense];

    const { transport } = toReimbursement(model, false).expenses;
    expect(transport.inbound).toHaveLength(1);
    expect(transport.onsite).toHaveLength(0);
    expect(transport.outbound).toHaveLength(1);
  });

  it('should include the material expenses', () => {
    const model = initialFormModel();
    const expense: MaterialExpense = {
      type: 'material',
      date: new Date(2025, 0, 1),
      purpose: 'Material',
      amount: 5,
    };
    model.expenses.material = [expense];

    expect(toReimbursement(model, false).expenses.material).toEqual([expense]);
  });

  it('should only include food expenses when enabled', () => {
    const model = initialFormModel();
    model.expenses.food = [food];

    expect(toReimbursement(model, false).expenses.food).toEqual([]);
    expect(toReimbursement(model, true).expenses.food).toEqual([food]);
  });

  it('should return the note', () => {
    const model = initialFormModel();
    model.overview.note = 'Hallo';
    expect(toReimbursement(model, false).note).toBe('Hallo');
  });
});
