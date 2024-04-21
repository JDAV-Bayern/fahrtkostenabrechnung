import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionService } from 'src/app/core/section.service';
import { logoBase64 } from 'src/assets/logoBase64';
import { Direction } from 'src/domain/expense.model';
import { Travel } from 'src/domain/travel.model';
import { Section } from 'src/domain/section.model';
import { MeetingTypePipe } from 'src/app/travel/shared/meeting-type.pipe';
import { DirectionPipe } from 'src/app/travel/shared/direction.pipe';
import { ExpenseTitlePipe } from 'src/app/expenses/shared/expense-title.pipe';
import { ExpenseAmountPipe } from 'src/app/expenses/shared/expense-amount.pipe';
import { ExpenseDetailsComponent } from 'src/app/expenses/shared/expense-details/expense-details.component';
import { TravelService } from '../../shared/travel.service';

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
    ExpenseTitlePipe,
    ExpenseAmountPipe,
    ExpenseDetailsComponent
  ]
})
export class PdfViewComponent {
  @Input({ required: true })
  travel!: Travel;

  @Output()
  fullyRendered = new EventEmitter<void>();

  section?: Section;

  constructor(
    private readonly travelService: TravelService,
    private readonly sectionService: SectionService
  ) {}

  get meeting() {
    return this.travel.meeting;
  }

  get participant() {
    return this.travel.participant;
  }

  get now() {
    return new Date();
  }

  get directions(): Direction[] {
    return ['inbound', 'onsite', 'outbound'];
  }

  get summary() {
    return this.travelService.getSummary(this.travel);
  }

  ngOnInit() {
    const sectionId = this.travel.participant.sectionId;
    this.section = this.sectionService.getSection(sectionId);
  }

  ngAfterViewInit() {
    this.fullyRendered.emit();
  }

  getLogo() {
    return logoBase64;
  }
}
