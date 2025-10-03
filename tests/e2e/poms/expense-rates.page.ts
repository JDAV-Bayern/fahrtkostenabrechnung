import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type ExpenseMeetingType = 'course' | 'committee';

export class ExpenseRatesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(type: ExpenseMeetingType = 'course'): Promise<void> {
    const query = type === 'committee' ? '?veranstaltung=gremium' : '';
    await super.goto(`/erstattungssaetze${query}`);
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Erstattungssätze' });
  }

  get transportSection(): Locator {
    return this.page.getByRole('heading', { name: 'Fahrtkosten' });
  }

  get perDiemSection(): Locator {
    return this.page.getByRole('heading', { name: 'Tagegeld' });
  }
}
