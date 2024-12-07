import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';
import { MeetingType } from 'src/domain/meeting.model';

type FormKey =
  | 'meetingStep'
  | 'participantStep'
  | 'transportExpensesStep'
  | 'expensesStep'
  | 'overviewStep';

type RouteOptions = string | { [key in MeetingType]: string };

function createGuard(form: FormKey, routeTo: RouteOptions): CanActivateFn {
  return route => {
    const controlService = inject(ReimbursementControlService);

    if (!controlService[form].valid) {
      if (typeof routeTo !== 'string') {
        const type = controlService.meetingStep.value.type || 'course';
        return createUrlTreeFromSnapshot(route, ['..', routeTo[type]]);
      }

      return createUrlTreeFromSnapshot(route, ['..', routeTo]);
    }

    return true;
  };
}

export const meetingGuard = createGuard('meetingStep', {
  course: 'kurs',
  assembly: 'ljv',
  committee: 'gremium'
});
export const participantGuard = createGuard('participantStep', 'teilnehmer_in');
export const transportExpensesGuard = createGuard(
  'transportExpensesStep',
  'auslagen'
);
export const expensesGuard = createGuard('expensesStep', {
  course: 'auslagen',
  assembly: 'auslagen',
  committee: 'auslagen-gremium'
});
