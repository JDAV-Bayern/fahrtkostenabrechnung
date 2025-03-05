import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterLink]
})
export class HeaderComponent {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);

  deleteAllData() {
    let originUrl: string;
    switch (this.controlService.meetingStep.value.type) {
      case 'course':
        originUrl = 'kurs';
        break;
      case 'assembly':
        originUrl = 'ljv';
        break;
      case 'committee':
        originUrl = 'gremium';
        break;
      default:
        originUrl = 'kurs';
    }
    this.controlService.deleteStoredData();
    this.router.navigate([originUrl]);
  }
}
