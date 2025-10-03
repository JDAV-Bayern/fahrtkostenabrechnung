import { Locator, Page } from '@playwright/test';
import { ReimbursementStepPage } from './reimbursement-step.page';

export interface MeetingDetails {
  purpose?: string;
  location?: string;
}

export interface DateTimeInput {
  date: string;
  time: string;
}

export class CommitteeStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  get purposeInput(): Locator {
    return this.page.locator('#purpose');
  }

  get locationInput(): Locator {
    return this.page.locator('#location');
  }

  get overnightCheckbox(): Locator {
    return this.page.locator('#overnight');
  }

  async goto(): Promise<void> {
    await super.goto('/gremium');
  }

  async fillMeetingDetails(details: MeetingDetails): Promise<void> {
    if (details.purpose !== undefined) {
      await this.purposeInput.fill(details.purpose);
    }
    if (details.location !== undefined) {
      await this.locationInput.fill(details.location);
    }
  }

  async setStart(values: DateTimeInput): Promise<void> {
    const group = this.page.getByRole('group', { name: 'Beginn der Reise' });
    await group.getByLabel('Datum').fill(values.date);
    await group.getByLabel('Uhrzeit').fill(values.time);
  }

  async setEnd(values: DateTimeInput): Promise<void> {
    const group = this.page.getByRole('group', { name: 'Ende der Reise' });
    await group.getByLabel('Datum').fill(values.date);
    await group.getByLabel('Uhrzeit').fill(values.time);
  }

  async setOvernight(enabled: boolean): Promise<void> {
    const checkbox = this.overnightCheckbox;
    const isChecked = await checkbox.isChecked();
    if (enabled !== isChecked && (await checkbox.isEnabled())) {
      await checkbox.click();
    }
  }
}
