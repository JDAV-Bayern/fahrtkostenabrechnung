import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { ReimbursementControlService } from './reimbursement-control.service';

export const disabledStepGuard: CanActivateFn = (route) => {
  const controlService = inject(ReimbursementControlService);
  const meetingType = controlService.meetingStep.controls.type.value;

  if (meetingType !== 'committee') {
    return createUrlTreeFromSnapshot(route, ['..', 'auslagen']);
  }

  return true;
};
