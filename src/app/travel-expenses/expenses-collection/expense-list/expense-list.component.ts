import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  FormDirection,
  ReimbursementService
} from 'src/app/reimbursement.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { FormArray, FormGroup } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  @Input({ required: true })
  direction!: FormDirection;

  @Input({ required: true })
  heading!: string;

  @Input()
  extraButton?: string;

  @Output()
  clickExtraButton = new EventEmitter<MouseEvent>();

  @Input()
  enterPredicate: (drag: CdkDrag, drop: CdkDropList) => boolean = () => true;

  formGroup!: FormGroup;
  formArray!: FormArray<FormGroup>;

  constructor(
    public dialog: MatDialog,
    private readonly reimbursementService: ReimbursementService
  ) {}

  ngOnInit() {
    this.formGroup = this.reimbursementService.expensesStep;
    this.formArray = this.reimbursementService.getExpenses(this.direction);
  }

  openAddExpenseDialog() {
    this.dialog
      .open(AddExpenseModalComponent, {
        data: { direction: this.direction },
        width: 'min(95vw, 700px)'
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.formArray.push(result);
          this.reimbursementService.saveForm();
        }
      });
  }

  deleteExpense(index: number) {
    this.formArray.removeAt(index);
    this.reimbursementService.saveForm();
  }

  onClickExtraButton(event: MouseEvent) {
    this.clickExtraButton.emit(event);
  }

  drop(event: CdkDragDrop<FormArray>) {
    const target = event.previousContainer.data.at(event.previousIndex);
    event.previousContainer.data.removeAt(event.previousIndex);
    event.container.data.insert(event.currentIndex, target);
    this.reimbursementService.saveForm();
  }
}
