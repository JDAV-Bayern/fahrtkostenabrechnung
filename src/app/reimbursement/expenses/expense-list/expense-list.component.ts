import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { Button } from 'src/app/shared/ui/button';
import { Expense } from 'src/domain/expense.model';
import {
  ExpenseDialogData,
  ExpenseExtraData,
  ExpenseModalComponent,
} from '../expense-modal/expense-modal.component';
import { MaterialExpenseCard } from '../material-expense-card/material-expense-card';
import { TransportExpenseCard } from '../transport-expense-card/transport-expense-card';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  imports: [
    Button,
    DialogModule,
    CdkDrag,
    CdkDropList,
    TransportExpenseCard,
    MaterialExpenseCard,
  ],
})
export class ExpenseListComponent<T extends Expense> {
  private readonly dialog = inject(Dialog);

  readonly type = input.required<T['type']>();
  readonly field = input.required<FieldTree<T[]>>();
  readonly dialogData = input<ExpenseExtraData<T>>();
  readonly enterPredicate = input<
    (drag: CdkDrag, drop: CdkDropList) => boolean
  >(() => true);

  readonly expenses = computed(() => this.field()().value());

  openCreateDialog() {
    this.openDialog().closed.subscribe((expense) => {
      if (expense) {
        this.field()().value.update((list) => [...list, expense]);
      }
    });
  }

  openEditDialog(original: T) {
    this.openDialog(original).closed.subscribe((expense) => {
      if (expense) {
        this.field()().value.update((list) =>
          list.map((item) => (item === original ? expense : item)),
        );
      }
    });
  }

  deleteExpense(expense: T) {
    this.field()().value.update((list) =>
      list.filter((item) => item !== expense),
    );
  }

  drop(event: CdkDragDrop<FieldTree<T[]>>) {
    const source = event.previousContainer.data;
    const target = event.container.data;
    const expense = source().value()[event.previousIndex];

    if (event.previousContainer === event.container) {
      target().value.update((list) => {
        const moved = list.filter((_, i) => i !== event.previousIndex);
        moved.splice(event.currentIndex, 0, expense);
        return moved;
      });
      return;
    }

    source().value.update((list) =>
      list.filter((_, i) => i !== event.previousIndex),
    );
    target().value.update((list) => {
      const inserted = [...list];
      inserted.splice(event.currentIndex, 0, expense);
      return inserted;
    });
  }

  private openDialog(expense?: T): DialogRef<T> {
    const data = {
      type: this.type(),
      expense,
      extra: this.dialogData(),
    } as ExpenseDialogData;

    return this.dialog.open<T, ExpenseDialogData>(ExpenseModalComponent, {
      data,
    });
  }
}
