import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ExpenseForm,
  ReimbursementControlService
} from 'src/app/reimbursement-control.service';
import {
  AddExpenseModalComponent,
  ExpenseDialogData
} from '../add-expense-modal/add-expense-modal.component';
import { FormArray, FormGroup } from '@angular/forms';
import { Direction } from 'src/domain/expense';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent {
  @Input({ required: true })
  direction!: Direction;

  @Input({ required: true })
  heading!: string;

  @Input()
  extraButton?: string;

  @Output()
  clickExtraButton = new EventEmitter<MouseEvent>();

  @Input()
  enterPredicate: (drag: CdkDrag, drop: CdkDropList) => boolean = () => true;

  formGroup!: FormGroup;
  formArray!: FormArray<FormGroup<ExpenseForm>>;

  constructor(
    public dialog: MatDialog,
    private readonly controlService: ReimbursementControlService
  ) {}

  ngOnInit() {
    this.formGroup = this.controlService.expensesStep;
    this.formArray = this.controlService.getExpenses(this.direction);
  }

  get showPlan() {
    console.log(
      this.direction,
      this.controlService.getExpenses(this.direction).controls
    );
    const directionOkay = this.direction !== 'onsite';
    const planExists = this.controlService
      .getExpenses(this.direction)
      .controls.some(
        (expense: FormGroup<ExpenseForm>) => expense.value.type === 'plan'
      );
    const showPlan = directionOkay && !planExists;
    console.log(directionOkay, planExists, showPlan);
    return showPlan;
  }

  openAddExpenseDialog() {
    const data: ExpenseDialogData = {
      direction: this.direction,
      showPlan: this.showPlan
    };
    this.dialog
      .open(AddExpenseModalComponent, {
        data,
        width: 'min(95vw, 700px)'
      })
      .afterClosed()
      .subscribe((result: FormGroup<ExpenseForm>) => {
        if (result) {
          this.formArray.push(result);
        }
      });
  }

  deleteExpense(index: number) {
    this.formArray.removeAt(index);
  }

  onClickExtraButton(event: MouseEvent) {
    this.clickExtraButton.emit(event);
  }

  drop(event: CdkDragDrop<FormArray>) {
    const target = event.previousContainer.data.at(event.previousIndex);
    event.previousContainer.data.removeAt(event.previousIndex);
    event.container.data.insert(event.currentIndex, target);
  }
}
