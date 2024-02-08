import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  Direction,
  IExpense,
  IPublicTransportPlanExpense,
  IPublicTransportPlanExpenseData,
  PublicTransportPlanExpense
} from 'src/domain/expense';

@Component({
  selector: 'app-plan-expense-form',
  templateUrl: './plan-expense-form.component.html',
  styleUrls: ['./plan-expense-form.component.css']
})
export class PlanExpenseFormComponent {
  @Input({ required: true })
  expense!: IExpense;

  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      inputFrom: ['', Validators.required],
      inputTo: ['', Validators.required]
    });
  }
  ngOnInit() {
    const planExpense =
      (this.expense as unknown as IPublicTransportPlanExpenseData) ?? {};
    this.formGroup.setValue({
      inputFrom: planExpense.startLocation ?? '',
      inputTo: planExpense.endLocation ?? ''
    });
  }
  submitForm() {
    const data: IPublicTransportPlanExpenseData = {
      price,
      startLocation: this.formGroup.value.inputFrom,
      endLocation: this.formGroup.value.inputTo
    };
    const returnExpense: IPublicTransportPlanExpense =
      new PublicTransportPlanExpense(data);
    this.dialog.getDialogById('add-expense-modal')?.close(returnExpense);
  }
}
