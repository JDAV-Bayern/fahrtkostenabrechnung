import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpenseService } from 'src/app/expense.service';
import { SectionService } from 'src/app/section.service';
import { logoBase64 } from 'src/assets/logoBase64';
import { Direction } from 'src/domain/expense';
import { Reimbursement } from 'src/domain/reimbursement';
import { Section } from 'src/domain/section';
import { MeetingTypePipe } from 'src/app/pipes/meeting-type.pipe';
import { DirectionPipe } from 'src/app/pipes/direction.pipe';
import { ExpenseAmountPipe, ExpenseTypePipe } from 'src/app/pipes/expense.pipe';
import { ExpenseDetailsComponent } from '../../expense/expense-details/expense-details.component';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    CurrencyPipe,
    MeetingTypePipe,
    DirectionPipe,
    ExpenseTypePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class PdfViewComponent {
  @Input({ required: true })
  reimbursement!: Reimbursement;

  @Output()
  fullyRendered = new EventEmitter<void>();

  section?: Section;

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

  get directions(): Direction[] {
    return ['inbound', 'onsite', 'outbound'];
  }

  get summary() {
    return this.expenseService.getSummary(this.reimbursement);
  }

  ngOnInit() {
    const sectionId = this.reimbursement.participant.sectionId;
    this.section = this.sectionService.getSection(sectionId);
  }

  ngAfterViewInit() {
    this.fullyRendered.emit();
  }

  getLogo() {
    return logoBase64;
  }
}
