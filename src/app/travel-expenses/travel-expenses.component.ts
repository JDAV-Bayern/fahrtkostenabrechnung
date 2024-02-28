import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReimbursementService } from '../reimbursement.service';

@Component({
  selector: 'app-travel-expenses',
  templateUrl: './travel-expenses.component.html',
  styleUrls: ['./travel-expenses.component.css']
})
export class TravelExpensesComponent implements OnInit {
  travelExpensesForm: FormGroup;

  constructor(private readonly reimbursementService: ReimbursementService) {
    this.travelExpensesForm = this.reimbursementService.travelExpensesForm;
  }

  ngOnInit() {
    this.reimbursementService.loadForm();
  }

  onChange() {
    this.reimbursementService.saveForm();
  }
}
