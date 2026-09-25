import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { startWith } from 'rxjs';
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
    ReactiveFormsModule,
    DialogModule,
    CdkDrag,
    CdkDropList,
    TransportExpenseCard,
    MaterialExpenseCard,
  ],
})
export class ExpenseListComponent<T extends Expense> implements OnInit {
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly type = input.required<T['type']>();
  readonly form = input.required<FormArray<FormControl<T>>>();
  readonly dialogData = input<ExpenseExtraData<T>>();
  readonly enterPredicate = input<
    (drag: CdkDrag, drop: CdkDropList) => boolean
  >(() => true);

  readonly controls = signal<FormControl<T>[]>([]);

  parent!: FormGroup;

  ngOnInit() {
    this.parent = this.form().parent as FormGroup;
    this.form()
      .valueChanges.pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controls.set([...this.form().controls]));
  }

  openCreateDialog() {
    const control = new FormControl({} as T, { nonNullable: true });
    this.openEditDialog(control).closed.subscribe(() => {
      if (control?.valid) {
        this.form().push(control);
      }
    });
  }

  openEditDialog(control: FormControl<T>): DialogRef<never> {
    return this.dialog.open<never, ExpenseDialogData<T>>(
      ExpenseModalComponent<T>,
      {
        data: {
          type: this.type(),
          control: control,
          extra: this.dialogData(),
        },
      },
    );
  }

  deleteExpense(index: number) {
    this.form().removeAt(index);
  }

  drop(event: CdkDragDrop<FormArray<FormControl<T>>>) {
    const target = event.previousContainer.data.at(event.previousIndex);
    event.previousContainer.data.removeAt(event.previousIndex);
    event.container.data.insert(event.currentIndex, target);
  }
}
