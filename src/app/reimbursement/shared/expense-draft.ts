import {
  Discount,
  EngineType,
  MaterialExpense,
  TransportExpense,
  TransportMode,
} from 'src/domain/expense.model';

/*
 * Drafts are what the expense dialogs edit. They are flat (every field exists
 * for every mode), because a form field tree of a union type only exposes the
 * fields that all members share. The builders pick the fields that belong to
 * the selected mode.
 */

export interface TransportExpenseDraft {
  mode: TransportMode | null;
  origin: string;
  destination: string;
  distance: number | null;
  carTrip: { engineType: EngineType; passengers: string[] };
  ticket: { price: number | null; discount: Discount };
}

export const emptyTransportDraft = (): TransportExpenseDraft => ({
  mode: null,
  origin: '',
  destination: '',
  distance: 0,
  carTrip: { engineType: 'combustion', passengers: [] },
  ticket: { price: 0, discount: 'none' },
});

export function draftFromTransportExpense(
  expense: TransportExpense,
): TransportExpenseDraft {
  const draft: TransportExpenseDraft = {
    ...emptyTransportDraft(),
    mode: expense.mode,
    origin: expense.origin,
    destination: expense.destination,
  };

  switch (expense.mode) {
    case 'car':
      draft.distance = expense.distance;
      draft.carTrip = {
        engineType: expense.carTrip.engineType,
        passengers: [...expense.carTrip.passengers],
      };
      break;
    case 'bike':
      draft.distance = expense.distance;
      break;
    case 'public':
      draft.ticket = { ...expense.ticket };
      break;
  }

  return draft;
}

export function buildTransportExpense(
  draft: TransportExpenseDraft,
): TransportExpense {
  // the order of the keys ends up in the generated PDF, keep it stable
  const { origin, destination } = draft;
  const distance = draft.distance ?? 0;

  switch (draft.mode) {
    case 'car':
      return {
        type: 'transport',
        mode: 'car',
        origin,
        destination,
        distance,
        carTrip: {
          engineType: draft.carTrip.engineType,
          passengers: [...draft.carTrip.passengers],
        },
      };
    case 'bike':
      return { type: 'transport', mode: 'bike', origin, destination, distance };
    case 'public':
      return {
        type: 'transport',
        mode: 'public',
        origin,
        destination,
        ticket: {
          price: draft.ticket.price ?? 0,
          discount: draft.ticket.discount,
        },
      };
    case 'plan':
      return { type: 'transport', mode: 'plan', origin, destination };
    default:
      throw new Error('A transport expense needs a mode');
  }
}

export interface MaterialExpenseDraft {
  date: Date | null;
  purpose: string;
  amount: number | null;
}

export const emptyMaterialDraft = (): MaterialExpenseDraft => ({
  date: null,
  purpose: '',
  amount: 0,
});

export const draftFromMaterialExpense = (
  expense: MaterialExpense,
): MaterialExpenseDraft => ({
  date: expense.date,
  purpose: expense.purpose,
  amount: expense.amount,
});

export const buildMaterialExpense = (
  draft: MaterialExpenseDraft,
): MaterialExpense => ({
  type: 'material',
  date: draft.date ?? new Date(NaN),
  purpose: draft.purpose,
  amount: draft.amount ?? 0,
});
