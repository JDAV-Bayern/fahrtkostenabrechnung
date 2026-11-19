import { Meeting } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { ReimbursementFormModel } from './reimbursement-form.model';

/*
 * The form model always contains every field. These functions pick the data
 * that belongs to the selected meeting type, so the key order of the result
 * (which ends up in the generated PDF) stays stable.
 */

export function toMeeting(meeting: ReimbursementFormModel['meeting']): Meeting {
  if (meeting.type === 'committee') {
    return {
      type: 'committee',
      name: meeting.name,
      location: meeting.location,
      time: {
        start: meeting.time.start || new Date(NaN),
        end: meeting.time.end || new Date(NaN),
      },
    };
  }

  return { type: 'course', name: meeting.name, code: meeting.code };
}

export function toReimbursement(
  model: ReimbursementFormModel,
  foodEnabled: boolean,
): Reimbursement {
  const { participant, expenses } = model;

  return {
    meeting: toMeeting(model.meeting),
    participant: {
      ...participant,
      sectionId: participant.sectionId || 0,
    },
    expenses: {
      transport: expenses.transport,
      food: foodEnabled ? expenses.food : [],
      material: expenses.material,
    },
    note: model.overview.note,
  };
}
