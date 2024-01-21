import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Direction, IExpense, IPublicTransportPlanExpense, IPublicTransportPlanExpenseData, PublicTransportPlanExpense } from 'src/domain/expense';

@Component({
  selector: 'app-plan-expense-form',
  templateUrl: './plan-expense-form.component.html',
  styleUrls: ['./plan-expense-form.component.css']
})
export class PlanExpenseFormComponent {
  @Input({ required: true })
  direction!: Direction;
  @Input({ required: true })
  expense!: IExpense

  formGroup: FormGroup
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog) {
    this.formGroup = this.formBuilder.group({
      inputType: ['dtFullPrice', Validators.required],
      inputFrom: ['', Validators.required],
      inputTo: ['', Validators.required],
      inputPrice: [0, [Validators.required, Validators.max(49), Validators.pattern(/^[0-9]+(?:[.,][0-9]+)?$/)]]
    })
  }
  ngOnInit() {
    const planExpense = this.expense as unknown as IPublicTransportPlanExpenseData ?? {};
    this.formGroup.setValue({
      inputType: planExpense.price === 49 ? 'dtFullPrice'
        : planExpense.price === 29 ? 'dtStudents'
          : 'other',
      inputFrom: planExpense.startLocation ?? '',
      inputTo: planExpense.endLocation ?? '',
      inputPrice: planExpense.price ?? 0
    })
  }
  submitForm() {

    const priceString = this.formGroup.value.inputPrice?.toString() ?? '';
    const price = this.formGroup.value.inputType === 'dtFullPrice' ? 49
      : this.formGroup.value.inputType === 'dtStudents' ? 29
        : Number(priceString.replace(',', '.'));
    const data: IPublicTransportPlanExpenseData = {
      price,
      direction: this.direction,
      startLocation: this.formGroup.value.inputFrom,
      endLocation: this.formGroup.value.inputTo
    }
    const returnExpense: IPublicTransportPlanExpense = new PublicTransportPlanExpense(data);
    this.dialog.getDialogById('add-expense-modal')?.close(returnExpense);
  }
}
