import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IReimbursement } from 'src/domain/reimbursement';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
})

export class PdfViewComponent {

  @Input({ required: true })
  reimbursement!: IReimbursement;

  @Output()
  fullyRendered = new EventEmitter<void>();


  ngAfterViewInit() {
    console.log("pdf fully rendered")
    this.fullyRendered.emit();
  }

  getDate() {
    //Get date in the format DD.MM.YYYY
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  r() {
    return this.reimbursement;
  }
  getSum() {
    const expensesSum = this.r()?.expenses.reduce((sum, expense) => sum + expense.totalReimbursement(), 0);
    if (this.reimbursement.participantDetails.isBavaria) {
      return expensesSum.toFixed(2);
    }
    return `(${expensesSum.toFixed(2)}) -> ${Math.min(expensesSum, 75).toFixed(2)}`;
  }
}
