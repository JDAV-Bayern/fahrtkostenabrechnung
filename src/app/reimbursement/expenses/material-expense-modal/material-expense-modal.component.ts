import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  min,
  required,
} from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  buildMaterialExpense,
  draftFromMaterialExpense,
  emptyMaterialDraft,
} from 'src/app/reimbursement/shared/expense-draft';
import { Button } from 'src/app/shared/ui/button';
import { MaterialExpense } from 'src/domain/expense.model';

@Component({
  selector: 'app-material-expense-modal',
  templateUrl: './material-expense-modal.component.html',
  styleUrls: ['./material-expense-modal.component.css'],
  imports: [Button, FormField, FormRoot, MatDatepickerModule],
})
export class MaterialExpenseModalComponent implements OnInit {
  private readonly dialogRef = inject<DialogRef<MaterialExpense>>(DialogRef);

  /** The expense to edit, a new expense is created without it. */
  readonly expense = input<MaterialExpense>();

  private readonly draft = signal(emptyMaterialDraft());

  form = form(this.draft, (p) => {
    required(p.date);
    required(p.purpose);
    required(p.amount);
    min(p.amount, 0);
  });

  get now() {
    return new Date();
  }

  ngOnInit() {
    const expense = this.expense();
    if (expense) {
      this.draft.set(draftFromMaterialExpense(expense));
    }
  }

  submitForm() {
    // implicit submission (e.g. Enter key) can bypass the disabled button
    if (this.form().invalid()) return;

    this.dialogRef.close(buildMaterialExpense(this.draft()));
  }
}
