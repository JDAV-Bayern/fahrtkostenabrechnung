import {
  Direction,
  FoodExpense,
  MaterialExpense,
  TransportExpense,
} from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';

/**
 * The data edited by the reimbursement wizard.
 *
 * It keeps the nested shape of the JSON that is stored in the local storage.
 * Fields that only apply to one meeting type (or only to some IBANs) are always
 * part of the model; the schema hides them instead.
 */
export interface ReimbursementFormModel {
  meeting: {
    type: MeetingType;
    name: string;
    /** committees only */
    location: string;
    /** committees only */
    time: { start: Date | null; end: Date | null };
    /** courses only */
    code: string;
  };
  participant: {
    givenName: string;
    familyName: string;
    sectionId: number | null;
    zipCode: string;
    city: string;
    iban: string;
    /** only for IBANs that require a BIC */
    bic: string;
  };
  expenses: {
    transport: Record<Direction, TransportExpense[]>;
    food: FoodExpense[];
    material: MaterialExpense[];
  };
  overview: {
    note: string;
  };
}

/** Local state that is not part of the final data. */
export interface FoodSettings {
  isEnabled: boolean;
  isOvernight: boolean;
}

export const initialFormModel = (): ReimbursementFormModel => ({
  meeting: {
    type: 'course',
    name: '',
    location: '',
    time: { start: null, end: null },
    code: '',
  },
  participant: {
    givenName: '',
    familyName: '',
    sectionId: null,
    zipCode: '',
    city: '',
    iban: '',
    bic: '',
  },
  expenses: {
    transport: { inbound: [], onsite: [], outbound: [] },
    food: [],
    material: [],
  },
  overview: { note: '' },
});

export const initialFoodSettings = (): FoodSettings => ({
  isEnabled: false,
  isOvernight: false,
});
