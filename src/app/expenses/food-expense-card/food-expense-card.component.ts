import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, Subscription } from 'rxjs';
import { ReimbursementService } from 'src/app/reimbursement/shared/reimbursement.service';
import { Absence, FoodExpense } from 'src/domain/expense.model';
import { ExpenseAmountPipe } from '../shared/expense-amount.pipe';
import { AbsencePipe } from '../shared/expense-data.pipe';

let nextInputId = 0;

@Component({
  selector: 'app-food-expense-card',
  templateUrl: './food-expense-card.component.html',
  styleUrls: ['./food-expense-card.component.css'],
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    AbsencePipe,
    ExpenseAmountPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FoodExpenseCardComponent,
      multi: true,
    },
  ],
})
export class FoodExpenseCardComponent implements ControlValueAccessor {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly reimbursementService = inject(ReimbursementService);

  form = this.formBuilder.group({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  onChangeSub?: Subscription;
  onTouched: () => void = () => {};

  inputId = nextInputId++;
  expense: FoodExpense | null = null;

  get updatedExpense(): FoodExpense | null {
    return this.expense ? { ...this.expense, ...this.form.value } : null;
  }

  writeValue(val: FoodExpense | null): void {
    if (val) {
      this.expense = val;
      this.form.setValue(
        { breakfast: val.breakfast, lunch: val.lunch, dinner: val.dinner },
        { emitEvent: false },
      );
    } else {
      this.expense = null;
      this.form.reset();
    }
  }

  registerOnChange(fn: (val: FoodExpense | null) => void): void {
    this.onChangeSub?.unsubscribe();
    this.onChangeSub = this.form.valueChanges
      .pipe(
        map((meals) => (this.expense ? { ...this.expense, ...meals } : null)),
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  getAllowance(absence: Absence) {
    const foodConfig = this.reimbursementService.config.food;
    return foodConfig ? foodConfig[absence] : 0;
  }
}
