import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ReimbursementControlService } from './shared/reimbursement-control.service';

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css'],
  imports: [RouterOutlet, ReactiveFormsModule]
})
export class ReimbursementComponent {
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.form;
}
