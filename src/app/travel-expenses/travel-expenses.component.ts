import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReimbursementControlService } from '../reimbursement-control.service';

@Component({
  selector: 'app-travel-expenses',
  templateUrl: './travel-expenses.component.html',
  styleUrls: ['./travel-expenses.component.css']
})
export class TravelExpensesComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly controlService: ReimbursementControlService) {
    this.form = this.controlService.form;
  }

  ngOnInit() {
    this.controlService.loadForm();
  }

  onChange() {
    this.controlService.saveForm();
  }
}
