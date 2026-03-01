import { test as base, expect } from '@playwright/test';
import {
  CommitteeStepPage,
  CourseStepPage,
  DataProtectionPage,
  ExpenseRatesPage,
  ExpensesExtraStepPage,
  ExpensesStepPage,
  OverviewStepPage,
  ParticipantStepPage,
} from './poms';

const reimbursementConfigByType = {
  committee: {
    allowed: ['transport', 'food', 'material'],
    transport: {
      car: [0.1, 0.12, 0.14, 0.16],
      public: {
        none: 1,
        BC25: 1.05,
        BC50: 1.1,
      },
      bike: 0.13,
      plan: 14.5,
    },
    food: {
      arrival: 14,
      full: 28,
      departure: 14,
      single_day: 14,
    },
    maxTotal: null,
  },
  course: {
    allowed: ['transport', 'material'],
    transport: {
      car: [0.1, 0.12, 0.15, 0.18],
      public: {
        none: 1,
        BC25: 1.05,
        BC50: 1.1,
      },
      bike: 0.13,
      plan: 14.5,
    },
    food: {
      arrival: 14,
      full: 28,
      departure: 14,
      single_day: 14,
    },
    maxTotal: null,
  },
} as const;

export const test = base.extend<{
  courseStepPage: CourseStepPage;
  committeeStepPage: CommitteeStepPage;
  participantStepPage: ParticipantStepPage;
  expensesStepPage: ExpensesStepPage;
  expensesExtraStepPage: ExpensesExtraStepPage;
  overviewStepPage: OverviewStepPage;
  dataProtectionPage: DataProtectionPage;
  expenseRatesPage: ExpenseRatesPage;
}>({
  page: async ({ page }, use) => {
    await page.route('**/reimbursement-config/**', async (route) => {
      const url = new URL(route.request().url());
      const segments = url.pathname.split('/').filter(Boolean);
      const meetingType = segments.at(-1)?.toLowerCase();
      const config =
        meetingType && meetingType in reimbursementConfigByType
          ? reimbursementConfigByType[
              meetingType as keyof typeof reimbursementConfigByType
            ]
          : reimbursementConfigByType.course;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(config),
      });
    });

    await use(page);
  },
  courseStepPage: async ({ page }, use) => {
    await use(new CourseStepPage(page));
  },
  committeeStepPage: async ({ page }, use) => {
    await use(new CommitteeStepPage(page));
  },
  participantStepPage: async ({ page }, use) => {
    await use(new ParticipantStepPage(page));
  },
  expensesStepPage: async ({ page }, use) => {
    await use(new ExpensesStepPage(page));
  },
  expensesExtraStepPage: async ({ page }, use) => {
    await use(new ExpensesExtraStepPage(page));
  },
  overviewStepPage: async ({ page }, use) => {
    await use(new OverviewStepPage(page));
  },
  dataProtectionPage: async ({ page }, use) => {
    await use(new DataProtectionPage(page));
  },
  expenseRatesPage: async ({ page }, use) => {
    await use(new ExpenseRatesPage(page));
  },
});

export { expect };
