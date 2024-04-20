import { Component, Input } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { ExpenseCardComponent } from '../expense-card/expense-card.component';
import { DirectionPipe } from 'src/app/pipes/direction.pipe';
import { ExpenseType } from 'src/domain/expense';
import { ExpenseControlService } from 'src/app/expense-control.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    CdkDrag,
    CdkDropList,
    DirectionPipe,
    ExpenseCardComponent
  ]
})
export class ExpenseListComponent {
  @Input({ required: true })
  expenseType!: ExpenseType;

  @Input({ required: true })
  form!: FormArray<FormGroup>;

  @Input()
  openDialog?: (form?: FormGroup) => DialogRef<FormGroup>;

  @Input()
  enterPredicate: (drag: CdkDrag, drop: CdkDropList) => boolean = () => true;

  parent!: FormGroup;

  constructor(private controlService: ExpenseControlService) {}

  ngOnInit() {
    this.parent = this.form.parent as FormGroup;
  }

  getExpense(expenseForm: FormGroup) {
    return this.controlService.getExpense(this.expenseType, expenseForm.value);
  }

  openExpenseDialog(form?: FormGroup) {
    if (this.openDialog) {
      if (form) {
        this.openDialog(form);
      } else {
        this.openDialog().closed.subscribe(result => {
          if (result) {
            this.addExpense(result);
          }
        });
      }
    }
  }

  addExpense(result: any) {
    this.form.push(result);
  }

  deleteExpense(index: number) {
    this.form.removeAt(index);
  }

  drop(event: CdkDragDrop<FormArray>) {
    const target = event.previousContainer.data.at(event.previousIndex);
    event.previousContainer.data.removeAt(event.previousIndex);
    event.container.data.insert(event.currentIndex, target);
  }
}
