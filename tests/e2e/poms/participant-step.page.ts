import { Locator, Page, expect } from '@playwright/test';
import { ReimbursementStepPage } from './reimbursement-step.page';

export interface ParticipantDetails {
  givenName: string;
  familyName: string;
  zipCode: string;
  city: string;
  iban: string;
  bic?: string;
}

export class ParticipantStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  get givenNameInput(): Locator {
    return this.page.locator('#givenName');
  }

  get familyNameInput(): Locator {
    return this.page.locator('#familyName');
  }

  get sectionInput(): Locator {
    return this.page.locator('#section');
  }

  get zipCodeInput(): Locator {
    return this.page.locator('#zipCode');
  }

  get cityInput(): Locator {
    return this.page.locator('#city');
  }

  get ibanInput(): Locator {
    return this.page.locator('#iban');
  }

  get bicInput(): Locator {
    return this.page.locator('#bic');
  }

  async goto(): Promise<void> {
    await super.goto('/teilnehmer_in');
  }

  async fillParticipant(details: ParticipantDetails): Promise<void> {
    await this.givenNameInput.fill(details.givenName);
    await this.familyNameInput.fill(details.familyName);
    await this.zipCodeInput.fill(details.zipCode);
    await this.cityInput.fill(details.city);
    await this.ibanInput.fill(details.iban);

    if (details.bic) {
      await expect(this.bicInput).toBeEnabled();
      await this.bicInput.fill(details.bic);
    }
  }

  async selectSection(sectionName: string): Promise<void> {
    await this.sectionInput.fill(sectionName);
    const option = this.page
      .getByRole('option', { name: sectionName, exact: false })
      .first();
    await option.click();
  }
}
