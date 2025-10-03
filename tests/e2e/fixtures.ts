import { test as base, expect } from '@playwright/test';
import {
  CommitteeStepPage,
  CourseStepPage,
  DataProtectionPage,
  ExpensesExtraStepPage,
  ExpensesStepPage,
  ExpenseRatesPage,
  OverviewStepPage,
  ParticipantStepPage,
} from './poms';

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
