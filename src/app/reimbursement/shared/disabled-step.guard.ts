import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot
} from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';

@Injectable({ providedIn: 'root' })
export class DisabledStepGuard {
  constructor(private controlService: ReimbursementControlService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const meetingType = this.controlService.meetingStep.controls.type.value;
    if (meetingType === 'committee') {
      return true;
    } else {
      return createUrlTreeFromSnapshot(route, ['..', 'auslagen']);
    }
  }
}

export const disabledStepGuard: CanActivateFn = route => {
  return inject(DisabledStepGuard).canActivate(route);
};
