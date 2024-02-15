import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReimbursementService } from 'src/app/reimbursement.service';
import { logoBase64 } from 'src/assets/logoBase64';
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

  constructor(private readonly reimbursementService: ReimbursementService) {}

  ngAfterViewInit() {
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

  getLogo() {
    return logoBase64;
  }

  r() {
    return this.reimbursement;
  }
  getSum() {
    const expensesSum = this.reimbursementService.getSum();
    if (!this.reimbursement.participant.isBavaria && expensesSum > 75) {
      return `(${expensesSum.toFixed(2)}) -> 75.00`;
    }
    return expensesSum.toFixed(2);
  }
}
