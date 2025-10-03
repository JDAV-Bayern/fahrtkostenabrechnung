import { Locator, Page } from '@playwright/test';
import { ReimbursementStepPage } from './reimbursement-step.page';
import {
  TransportExpenseInput,
  TransportExpenseModal,
} from './transport-expense.modal';

export type TransportSectionLabel = 'Hinfahrt' | 'Vor Ort' | 'Rückfahrt';

export class ExpensesStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/auslagen');
  }

  get subtotal(): Locator {
    return this.page.locator('p.subtotal span').first();
  }

  private transportSection(title: TransportSectionLabel): Locator {
    return this.page
      .locator('app-expense-list')
      .filter({ has: this.page.getByRole('heading', { name: title }) })
      .first();
  }

  async addTransportExpense(
    section: TransportSectionLabel,
    expense: TransportExpenseInput,
  ): Promise<void> {
    const list = this.transportSection(section);
    await list.getByRole('button', { name: 'Auslage hinzufügen' }).click();

    const modal = new TransportExpenseModal(this.page);
    await modal.waitForOpen();
    await modal.fill(expense);
    await modal.submit();
  }

  async completeReturnTrip(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Rückfahrt wie Hinfahrt' })
      .click();
  }
}
