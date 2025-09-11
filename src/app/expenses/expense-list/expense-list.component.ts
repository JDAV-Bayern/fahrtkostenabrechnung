import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Expense } from 'src/domain/expense.model';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import {
  ExpenseDialogData,
  ExpenseExtraData,
  ExpenseModalComponent,
} from '../expense-modal/expense-modal.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  imports: [
    ReactiveFormsModule,
    DialogModule,
    CdkDrag,
    CdkDropList,
    ExpenseCardComponent,
  ],
})
export class ExpenseListComponent<T extends Expense> implements OnInit {
  private readonly dialog = inject(Dialog);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly type = input.required<T['type']>();
  readonly form = input.required<FormArray<FormControl<T>>>();
  readonly dialogData = input<ExpenseExtraData<T>>();
  readonly enterPredicate = input<
    (drag: CdkDrag, drop: CdkDropList) => boolean
  >(() => true);

  parent!: FormGroup;

  ngOnInit() {
    this.parent = this.form().parent as FormGroup;
  }

  openCreateDialog() {
    const control = new FormControl({} as T, { nonNullable: true });
    this.openEditDialog(control).closed.subscribe(() => {
      if (control?.valid) {
        this.form().push(control);
        this.changeDetector.markForCheck();
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
