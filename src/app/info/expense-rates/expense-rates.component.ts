import {
  CurrencyPipe,
  KeyValuePipe,
  Location,
  PercentPipe,
} from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ExpenseConfig } from 'src/app/reimbursement/expenses/expense.config';
import { ExpenseConfigService } from 'src/app/reimbursement/expenses/shared/expense-config.service';
import { DiscountPipe } from 'src/app/reimbursement/expenses/shared/expense-data.pipe';
import { Button } from 'src/app/shared/ui/button';
import { MeetingType } from 'src/domain/meeting.model';

@Component({
  selector: 'app-expense-rates',
  templateUrl: './expense-rates.component.html',
  styleUrls: ['./expense-rates.component.css'],
  imports: [CurrencyPipe, KeyValuePipe, PercentPipe, DiscountPipe, Button],
  host: {
    class: 'typography',
  },
})
export class ExpenseRatesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly expenseConfigService = inject(ExpenseConfigService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);

  config = signal<ExpenseConfig | null>(null);
  meetingType: MeetingType = 'course';

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const param = params.get('veranstaltung')!;
        const meetingType = param === 'gremium' ? 'committee' : 'course';

        this.meetingType = meetingType;
        this.expenseConfigService.getConfig(meetingType).subscribe((config) => {
          this.config.set(config);
        });
      });
  }
}
