import { Locator, Page } from '@playwright/test';

export interface MaterialExpenseInput {
  date: string;
  purpose: string;
  amount: number;
}

export class MaterialExpenseModal {
  private readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('app-material-expense-modal').first();
  }

  get saveButton(): Locator {
    return this.root.getByRole('button', { name: 'Speichern' });
  }

  async waitForOpen(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  async fill(expense: MaterialExpenseInput): Promise<void> {
    await this.root.locator('#date').fill(expense.date);
    await this.root.locator('#purpose').fill(expense.purpose);
    await this.root.locator('#amount').fill(String(expense.amount));
  }

  async submit(): Promise<void> {
    await this.saveButton.click();
  }
}
