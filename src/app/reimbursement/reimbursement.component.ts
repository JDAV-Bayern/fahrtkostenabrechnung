import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from './shared/reimbursement-control.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css'],
  imports: [RouterOutlet, ReactiveFormsModule]
})
export class ReimbursementComponent {
  form: FormGroup;

  constructor(private readonly controlService: ReimbursementControlService) {
    this.form = this.controlService.form;
  }
}
