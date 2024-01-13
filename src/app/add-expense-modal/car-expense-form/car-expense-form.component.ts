import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BikeExpense, CarExpense, Direction, IBikeExpenseData, ICarExpense, ICarExpenseData, IExpense } from 'src/domain/expense';

@Component({
  selector: 'app-car-expense-form',
  templateUrl: './car-expense-form.component.html',
  styleUrls: ['./car-expense-form.component.css']
})
export class CarExpenseFormComponent {
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
      inputDistance: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      carType: ['', Validators.required],
      passengers: [undefined, [Validators.pattern(/^([A-Z][a-z]+(?: [A-Z][a-z]+)*)?(?:, [A-Z][a-z]+(?: [A-Z][a-z]+)*)*$/)]]
    })
  }
  ngOnInit() {
    console.log("expense", this.expense)
    const carExpense = this.expense as ICarExpense ?? {};
    this.formGroup.setValue({
      inputFrom: carExpense.startLocation ?? '',
      inputTo: carExpense.endLocation ?? '',
      inputDistance: carExpense.distance ?? '',
      carType: carExpense.carType ?? '',
      passengers: (carExpense.passengers || []).join(', ')
    })
  }
  submitForm() {
    if (!this.formGroup.valid) {
      console.log("invalid form", this.formGroup)
      return;
    }
    const passengers = !['', undefined, null].includes(this.formGroup.value.passengers) ? (this.formGroup.value.passengers as string).split(',').map(passenger => passenger.trim()) : [];
    const data: ICarExpenseData = {
      distance: this.formGroup.value.inputDistance,
      direction: this.direction,
      startLocation: this.formGroup.value.inputFrom,
      endLocation: this.formGroup.value.inputTo,
      carType: this.formGroup.value.carType,
      passengers
    }
    const returnExpense = new CarExpense(data);
    this.dialog.getDialogById('add-expense-modal')?.close(returnExpense);
  }
}
