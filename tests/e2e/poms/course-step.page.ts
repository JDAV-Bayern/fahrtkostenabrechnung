import { Locator, Page } from '@playwright/test';
import { ReimbursementStepPage } from './reimbursement-step.page';

export interface CourseDetails {
  code?: string;
  name?: string;
}

export class CourseStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  get courseCodeInput(): Locator {
    return this.page.locator('#courseCode');
  }

  get courseNameInput(): Locator {
    return this.page.locator('#courseName');
  }

  async goto(): Promise<void> {
    await super.goto('/kurs');
  }

  async fill(details: CourseDetails): Promise<void> {
    if (details.code !== undefined) {
      await this.courseCodeInput.fill(details.code);
    }
    if (details.name !== undefined) {
      await this.courseNameInput.fill(details.name);
    }
  }
}
