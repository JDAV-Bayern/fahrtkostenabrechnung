import { CurrencyPipe, KeyValuePipe, PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { expenseConfig } from 'src/app/expenses/expense.config';
import {
  AbsencePipe,
  DiscountCardPipe,
  MealsPipe
} from 'src/app/expenses/shared/expense-data.pipe';
import { MeetingType } from 'src/domain/meeting.model';

@Component({
  selector: 'app-expense-rates',
  templateUrl: './expense-rates.component.html',
  styleUrls: ['./expense-rates.component.css'],
  imports: [
    CurrencyPipe,
    KeyValuePipe,
    PercentPipe,
    DiscountCardPipe,
    AbsencePipe,
    MealsPipe
  ]
})
export class ExpenseRatesComponent {
  config = expenseConfig.course;
  meetingType: MeetingType = 'course';

  readonly originalOrder = () => 0;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(params => {
      const param = params.get('veranstaltung')!;
      const meetingType = this.getMeetingType(param);

      if (meetingType) {
        this.meetingType = meetingType;
        this.config = expenseConfig[meetingType];
      } else {
        this.meetingType = 'course';
        this.config = expenseConfig.course;
      }
    });
  }

  getMeetingType(param: string): MeetingType | undefined {
    switch (param) {
      case 'kurs':
        return 'course';
      case 'ljv':
        return 'assembly';
      case 'gremium':
        return 'committee';
      default:
        return undefined;
    }
  }
}
