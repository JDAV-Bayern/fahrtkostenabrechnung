import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgFor,
  NgIf
} from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { logoBase64 } from 'src/assets/logoBase64';
import { Direction } from 'src/domain/expense.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { Federation, Section } from 'src/domain/section.model';
import { MeetingTypePipe } from 'src/app/reimbursement/shared/meeting-type.pipe';
import { DirectionPipe } from 'src/app/reimbursement/shared/direction.pipe';
import { ExpenseTitlePipe } from 'src/app/expenses/shared/expense-title.pipe';
import { ExpenseAmountPipe } from 'src/app/expenses/shared/expense-amount.pipe';
import { ExpenseDetailsComponent } from 'src/app/expenses/shared/expense-details/expense-details.component';
import { ReimbursementReport } from '../../shared/reimbursement.service';
import { Meeting } from 'src/domain/meeting.model';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    MeetingTypePipe,
    DirectionPipe,
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class PdfViewComponent {
  @Input({ required: true })
  reimbursement!: Reimbursement;

  @Input({ required: true })
  report!: ReimbursementReport;

  @Input({ required: true })
  meeting!: Meeting;

  @Input({ required: true })
  section!: Section & { state: Federation };

  @Output()
  fullyRendered = new EventEmitter<void>();

  get participant() {
    return this.reimbursement.participant;
  }

  get now() {
    return new Date();
  }

  get directions(): Direction[] {
    return ['inbound', 'onsite', 'outbound'];
  }

  ngAfterViewInit() {
    this.fullyRendered.emit();
  }

  getLogo() {
    return logoBase64;
  }

  getCourseNumber() {
    return 'number' in this.meeting ? this.meeting.number : '';
  }
}
