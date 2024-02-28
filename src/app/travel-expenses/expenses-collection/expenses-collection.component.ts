import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseService } from 'src/app/expense.service';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css']
})
export class ExpensesCollectionComponent {
  form: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly expenseService: ExpenseService,
    private readonly controlService: ReimbursementControlService
  ) {
    this.form = this.controlService.expensesStep;
  }

  getTotal() {
    const reimbursement = this.controlService.getReimbursment();
    return this.expenseService.getTotal(reimbursement).toFixed(2);
  }

  onsitePredicate(item: CdkDrag<FormControl>) {
    return item.data.value.type !== 'plan' && item.data.value.type !== 'bike';
  }

  completeReturnTrip() {
    this.controlService.completeReturnTrip();
  }

  continue() {
    this.router.navigate(['zusammenfassen-und-abschicken']);
  }

  back() {
    this.router.navigate(['kurs-und-personen-infos']);
  }
}
