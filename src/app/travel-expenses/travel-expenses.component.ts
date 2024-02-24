import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReimbursementControlService } from '../reimbursement-control.service';

@Component({
  selector: 'app-travel-expenses',
  templateUrl: './travel-expenses.component.html',
  styleUrls: ['./travel-expenses.component.css']
})
export class TravelExpensesComponent implements OnInit {
  travelExpensesForm: FormGroup;

  constructor(private readonly controlService: ReimbursementControlService) {
    this.travelExpensesForm = this.controlService.travelExpensesForm;
  }

  ngOnInit() {
    this.controlService.loadForm();
  }

  onChange() {
    this.controlService.saveForm();
  }
}
