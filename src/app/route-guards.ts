import { Inject, Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  UrlTree,
  createUrlTreeFromSnapshot
} from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';

type FormKey =
  | 'courseStep'
  | 'participantStep'
  | 'expensesStep'
  | 'overviewStep';

@Injectable({ providedIn: 'root' })
class FormFinishedGuard {
  constructor(
    private readonly reimbursementControlService: ReimbursementControlService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, form: FormKey, routeTo: string) {
    if (this.reimbursementControlService[form].valid) {
      return true;
    } else {
      return createUrlTreeFromSnapshot(route, ['..', routeTo]);
    }
  }
}

function createGuard(form: FormKey, routeTo: string): CanActivateFn {
  return (route, state) => {
    return inject(FormFinishedGuard).canActivate(route, form, routeTo);
  };
}

export const courseGuard = createGuard('courseStep', 'kurs');
export const participantGuard = createGuard('participantStep', 'teilnehmer-in');
export const expensesGuard = createGuard('expensesStep', 'auslagen');
