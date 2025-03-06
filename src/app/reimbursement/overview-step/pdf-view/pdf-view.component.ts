import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, input, output } from '@angular/core';
import { ExpenseAmountPipe } from 'src/app/expenses/shared/expense-amount.pipe';
import { ExpenseDetailsComponent } from 'src/app/expenses/shared/expense-details/expense-details.component';
import { ExpenseTitlePipe } from 'src/app/expenses/shared/expense-title.pipe';
import { Direction } from 'src/domain/expense.model';
import { Meeting } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { Federation, Section } from 'src/domain/section.model';
import { DirectionPipe } from '../../shared/direction.pipe';
import { MeetingTypePipe } from '../../shared/meeting-type.pipe';
import { ReimbursementReport } from '../../shared/reimbursement.service';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css'],
  imports: [
    DatePipe,
    CurrencyPipe,
    MeetingTypePipe,
    DirectionPipe,
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class PdfViewComponent implements AfterViewInit {
  readonly reimbursement = input.required<Reimbursement>();
  readonly report = input.required<ReimbursementReport>();
  readonly meeting = input.required<Meeting>();
  readonly section = input.required<Section & { state: Federation }>();

  readonly fullyRendered = output<void>();

  get participant() {
    return this.reimbursement().participant;
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

  getCourseNumber() {
    return 'number' in this.meeting ? this.meeting.number : '';
  }
}
