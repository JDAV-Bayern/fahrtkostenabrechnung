import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[jdav-header]',
  templateUrl: './header.component.html',
  imports: [RouterLink],
  host: {
    class: 'z-1 shadow-md',
  },
})
export class HeaderComponent {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);

  deleteAllData() {
    const control = this.controlService.meetingStep.controls.type;
    const meetingType = control.value;

    const originUrl = meetingType === 'committee' ? 'gremium' : 'kurs';

    this.controlService.deleteStoredData();
    control.setValue(meetingType);
    this.router.navigate([originUrl]);
  }
}
