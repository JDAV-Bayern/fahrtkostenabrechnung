import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot
} from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';
import { MeetingType } from 'src/domain/meeting';

type FormKey =
  | 'meetingStep'
  | 'participantStep'
  | 'expensesStep'
  | 'overviewStep';

type RouteOptions = string | { [key in MeetingType]: string };

@Injectable({ providedIn: 'root' })
class FormFinishedGuard {
  constructor(
    private readonly reimbursementControlService: ReimbursementControlService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    form: FormKey,
    routeTo: RouteOptions
  ) {
    if (this.reimbursementControlService[form].valid) {
      return true;
    } else {
      let resolvedRoute = '';
      if (typeof routeTo === 'string') {
        resolvedRoute = routeTo;
      } else {
        const type =
          this.reimbursementControlService.meetingStep.value.type || 'course';
        resolvedRoute = routeTo[type];
      }
      return createUrlTreeFromSnapshot(route, ['..', resolvedRoute]);
    }
  }
}

function createGuard(form: FormKey, routeTo: RouteOptions): CanActivateFn {
  return route => inject(FormFinishedGuard).canActivate(route, form, routeTo);
}

export const meetingGuard = createGuard('meetingStep', {
  course: 'kurs',
  assembly: 'ljv',
  committee: 'gremium'
});
export const participantGuard = createGuard('participantStep', 'teilnehmer_in');
export const expensesGuard = createGuard('expensesStep', 'auslagen');
