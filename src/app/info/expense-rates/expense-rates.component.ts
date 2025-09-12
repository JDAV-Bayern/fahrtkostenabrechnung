import { CurrencyPipe, KeyValuePipe, PercentPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { expenseConfig } from 'src/app/expenses/expense.config';
import { DiscountPipe } from 'src/app/expenses/shared/expense-data.pipe';
import { MeetingType } from 'src/domain/meeting.model';

@Component({
  selector: 'app-expense-rates',
  templateUrl: './expense-rates.component.html',
  styleUrls: ['./expense-rates.component.css'],
  imports: [CurrencyPipe, KeyValuePipe, PercentPipe, DiscountPipe],
  host: {
    class: 'typography',
  },
})
export class ExpenseRatesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  config = expenseConfig.course;
  meetingType: MeetingType = 'course';

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const param = params.get('veranstaltung')!;
      const meetingType = param === 'gremium' ? 'committee' : 'course';

      this.meetingType = meetingType;
      this.config = expenseConfig[meetingType];
    });
  }
}
