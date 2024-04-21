import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReimbursementControlService } from '../reimbursement-control.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-travel-expenses',
  templateUrl: './travel-expenses.component.html',
  styleUrls: ['./travel-expenses.component.css'],
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule]
})
export class TravelExpensesComponent {
  form: FormGroup;

  constructor(private readonly controlService: ReimbursementControlService) {
    this.form = this.controlService.form;
  }
}
