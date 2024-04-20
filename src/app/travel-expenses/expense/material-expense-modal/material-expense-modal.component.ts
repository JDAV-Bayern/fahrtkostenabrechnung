import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from '@danielmoncada/angular-datetime-picker';
import { ExpenseControlService } from 'src/app/expense-control.service';
import { FormValue, MaterialExpenseForm } from 'src/app/reimbursement-forms';

@Component({
  selector: 'app-material-expense-modal',
  templateUrl: './material-expense-modal.component.html',
  styleUrls: ['./material-expense-modal.component.css'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class MaterialExpenseModalComponent {
  form: FormGroup<MaterialExpenseForm>;

  initialFormValue: FormValue<MaterialExpenseForm>;

  constructor(
    private controlService: ExpenseControlService,
    private dialogRef: DialogRef<FormGroup<MaterialExpenseForm>>,
    @Inject(DIALOG_DATA) data: { form?: FormGroup<MaterialExpenseForm> }
  ) {
    this.form = data.form || this.controlService.createMaterialForm();

    this.initialFormValue = this.form.getRawValue();

    this.dialogRef.closed.subscribe(() => {
      if (!this.form.valid) {
        this.form.reset(this.initialFormValue);
      }
    });
  }

  get date() {
    return this.form.controls.date;
  }

  get purpose() {
    return this.form.controls.purpose;
  }

  get amount() {
    return this.form.controls.amount;
  }

  submitForm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }
}
