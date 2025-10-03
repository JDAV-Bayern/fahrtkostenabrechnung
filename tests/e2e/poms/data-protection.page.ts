import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DataProtectionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/datenschutz');
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { name: 'Datenschutzerklärung' });
  }
}
