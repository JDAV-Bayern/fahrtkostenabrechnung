import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  BikeExpense,
  Direction,
  IBikeExpenseData,
  IExpense
} from 'src/domain/expense';

@Component({
  selector: 'app-bike-expense-form',
  templateUrl: './bike-expense-form.component.html',
  styleUrls: ['./bike-expense-form.component.css']
})
export class BikeExpenseFormComponent {
  @Input({ required: true })
  direction!: Direction;
  @Input({ required: true })
  expense!: IExpense;

  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.formGroup = this.formBuilder.group({
      inputFrom: ['', Validators.required],
      inputTo: ['', Validators.required],
      inputDistance: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }
  ngOnInit() {
    const bikeExpense = (this.expense as unknown as IBikeExpenseData) ?? {};
    this.formGroup.setValue({
      inputFrom: bikeExpense.startLocation ?? '',
      inputTo: bikeExpense.endLocation ?? '',
      inputDistance: bikeExpense.distance ?? ''
    });
  }

  submitForm() {
    const data: IBikeExpenseData = {
      distance: this.formGroup.value.inputDistance,
      direction: this.direction,
      startLocation: this.formGroup.value.inputFrom,
      endLocation: this.formGroup.value.inputTo
    };
    const returnExpense = new BikeExpense(data);
    this.dialog.getDialogById('add-expense-modal')?.close(returnExpense);
  }
}
