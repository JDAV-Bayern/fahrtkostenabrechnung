import { CdkDrag, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { ExpenseService } from 'src/app/expense.service';
import { NgIf } from '@angular/common';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { FormCardComponent } from 'src/app/form-card/form-card.component';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    CdkDropListGroup,
    FormCardComponent,
    ExpenseListComponent
  ]
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
