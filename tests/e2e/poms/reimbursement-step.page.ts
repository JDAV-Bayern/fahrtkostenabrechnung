import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export abstract class ReimbursementStepPage extends BasePage {
  protected constructor(page: Page) {
    super(page);
  }

  protected get formCard(): Locator {
    return this.page.locator('app-form-card');
  }

  get nextButton(): Locator {
    return this.formCard.getByRole('button', { name: 'Weiter' });
  }

  get previousButton(): Locator {
    return this.formCard.getByRole('button', { name: 'Zurück' });
  }

  get submitButton(): Locator {
    return this.formCard.locator('[submitButton]');
  }

  async continue(): Promise<void> {
    await this.nextButton.click();
  }

  async goBack(): Promise<void> {
    await this.previousButton.click();
  }
}
