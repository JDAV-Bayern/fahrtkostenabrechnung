import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseService } from 'src/app/expense.service';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css']
})
export class ExpensesCollectionComponent {
  form;

  constructor(
    private readonly router: Router,
    private readonly expenseService: ExpenseService,
    private readonly controlService: ReimbursementControlService
  ) {
    this.form = this.controlService.expensesStep;
  }

  ngOnInit() {
    if (!this.controlService.courseStep.valid) {
      this.router.navigate(['kurs']);
    }
    if (!this.controlService.participantStep.valid) {
      this.router.navigate(['teilnehmer-in']);
    }
  }

  getTotal() {
    const reimbursement = this.controlService.getReimbursement();
    return this.expenseService.getTotal(reimbursement).toFixed(2);
  }

  onsitePredicate(item: CdkDrag<FormControl>) {
    return item.data.value.type !== 'plan' && item.data.value.type !== 'bike';
  }

  completeReturnTrip() {
    this.controlService.completeReturnTrip();
  }
}
