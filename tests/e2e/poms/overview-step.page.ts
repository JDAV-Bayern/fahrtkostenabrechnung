import { Download, Locator, Page } from '@playwright/test';
import { ReimbursementStepPage } from './reimbursement-step.page';

export class OverviewStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/zusammenfassung');
  }

  get noteTextarea(): Locator {
    return this.page.locator('#note');
  }

  get downloadPdfButton(): Locator {
    return this.submitButton;
  }

  get receiptDropArea(): Locator {
    return this.page.locator('ngx-file-drop');
  }

  get receiptList(): Locator {
    return this.page.locator('.files-list .file-list-entry');
  }

  async downloadPdf(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadPdfButton.click(),
    ]);
    return download;
  }

  async uploadReceipt(filePath: string | string[]): Promise<void> {
    const input = this.receiptDropArea.locator('input[type="file"]').first();
    await input.setInputFiles(filePath);
  }

  async removeReceipt(fileName: string): Promise<void> {
    await this.receiptList
      .filter({ hasText: fileName })
      .getByRole('button', { name: 'delete' })
      .click();
  }
}
