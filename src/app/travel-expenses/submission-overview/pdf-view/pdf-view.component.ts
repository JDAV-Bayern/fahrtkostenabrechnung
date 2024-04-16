import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpenseService } from 'src/app/expense.service';
import { SectionService } from 'src/app/section.service';
import { logoBase64 } from 'src/assets/logoBase64';
import { Reimbursement } from 'src/domain/reimbursement';
import { Section } from 'src/domain/section';
import { PdfExpenseLineItemComponent } from '../pdf-expense-line-item/pdf-expense-line-item.component';
import { MeetingTypePipe } from 'src/app/pipes/meeting-type.pipe';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, MeetingTypePipe, PdfExpenseLineItemComponent]
})
export class PdfViewComponent {
  @Input({ required: true })
  reimbursement!: Reimbursement;

  @Output()
  fullyRendered = new EventEmitter<void>();

  section?: Section;
  isBavarian: boolean = true;

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly sectionService: SectionService
  ) {}

  get meeting() {
    return this.reimbursement.meeting;
  }

  get participant() {
    return this.reimbursement.participant;
  }

  get now() {
    return new Date();
  }

  ngOnInit() {
    const sectionId = this.reimbursement.participant.sectionId;
    this.section = this.sectionService.getSection(sectionId);
    this.isBavarian = this.section
      ? this.sectionService.isBavarian(this.section)
      : false;
  }

  ngAfterViewInit() {
    this.fullyRendered.emit();
  }

  getLogo() {
    return logoBase64;
  }

  getTotal() {
    const expensesSum = this.expenseService.getTotal(this.reimbursement);
    if (!this.isBavarian && expensesSum > 75) {
      return `(${expensesSum.toFixed(2)}) -> 75.00`;
    }
    return expensesSum.toFixed(2);
  }
}
