import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpenseService } from 'src/app/expense.service';
import { SectionService } from 'src/app/section.service';
import { logoBase64 } from 'src/assets/logoBase64';
import { Reimbursement } from 'src/domain/reimbursement';
import { Section } from 'src/domain/section';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
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

  get course() {
    return this.reimbursement.course;
  }

  get participant() {
    return this.reimbursement.participant;
  }

  ngOnInit() {
    const sectionId = this.reimbursement.participant.sectionId;
    this.section = sectionId
      ? this.sectionService.getSection(sectionId)
      : undefined;
    this.isBavarian = this.section
      ? this.sectionService.isBavarian(this.section)
      : false;
  }

  ngAfterViewInit() {
    this.fullyRendered.emit();
  }

  getDate() {
    //Get date in the format DD.MM.YYYY
    const date = new Date();
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
