import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot
} from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';
import { MeetingType } from 'src/domain/meeting.model';

type FormKey =
  | 'meetingStep'
  | 'participantStep'
  | 'transportExpensesStep'
  | 'expensesStep'
  | 'overviewStep';

type RouteOptions = string | { [key in MeetingType]: string };

@Injectable({ providedIn: 'root' })
class FinishedStepGuard {
  constructor(private controlService: ReimbursementControlService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    form: FormKey,
    routeTo: RouteOptions
  ) {
    if (this.controlService[form].valid) {
      return true;
    } else {
      let resolvedRoute = '';
      if (typeof routeTo === 'string') {
        resolvedRoute = routeTo;
      } else {
        const type = this.controlService.meetingStep.value.type || 'course';
        resolvedRoute = routeTo[type];
      }
      return createUrlTreeFromSnapshot(route, ['..', resolvedRoute]);
    }
  }
}

function createGuard(form: FormKey, routeTo: RouteOptions): CanActivateFn {
  return route => inject(FinishedStepGuard).canActivate(route, form, routeTo);
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
