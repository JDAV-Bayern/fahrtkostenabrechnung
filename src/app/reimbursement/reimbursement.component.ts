import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReimbursementControlService } from './shared/reimbursement-control.service';

@Component({
  selector: 'jdav-reimbursement',
  templateUrl: './reimbursement.component.html',
  imports: [RouterOutlet, ReactiveFormsModule],
  host: {
    class: 'block h-full bg-gray-50',
  },
})
export class ReimbursementComponent {
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.form;
}
