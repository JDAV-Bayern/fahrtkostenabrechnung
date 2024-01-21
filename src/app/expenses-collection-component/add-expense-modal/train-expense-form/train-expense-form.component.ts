import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Direction, ICarExpense, IExpense, ITrainExpense, ITrainExpenseData, TrainExpense } from 'src/domain/expense';

@Component({
  selector: 'app-train-expense-form',
  templateUrl: './train-expense-form.component.html',
  styleUrls: ['./train-expense-form.component.css']
})
export class TrainExpenseFormComponent {
  @Input({ required: true })
  direction!: Direction;

  @Input({ required: true })
  expense!: IExpense;

  formGroup: FormGroup
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog) {
    this.formGroup = this.formBuilder.group({
      inputFrom: ['', Validators.required],
      inputTo: ['', Validators.required],
      inputPrice: ['', [Validators.required, Validators.min(0)]],
      inputDiscountCard: ['', Validators.required],
    })
  }
  ngOnInit() {
    const trainExpense = this.expense as ITrainExpense ?? {};
    this.formGroup.setValue({
      inputFrom: trainExpense.startLocation ?? '',
      inputTo: trainExpense.endLocation ?? '',
      inputPrice: trainExpense.priceWithDiscount?.toFixed(2) ?? '',
      inputDiscountCard: trainExpense.discountCard ?? ''
    })
  }
  submitForm() {
    if (!this.formGroup.valid) {
      return;
    }
    const data: ITrainExpenseData = {
      direction: this.direction,
      startLocation: this.formGroup.value.inputFrom,
      endLocation: this.formGroup.value.inputTo,
      priceWithDiscount: Number(this.formGroup.value.inputPrice.replace(',', '.').trim()),
      discountCard: this.formGroup.value.inputDiscountCard
    }
    const returnExpense = new TrainExpense(data);
    this.dialog.getDialogById('add-expense-modal')?.close(returnExpense);
  }
}

