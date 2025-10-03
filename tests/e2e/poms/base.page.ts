import { Locator, Page, expect } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get header(): Locator {
    return this.page.locator('header[jdav-header]');
  }

  get deleteStoredDataButton(): Locator {
    return this.header.getByRole('button', { name: 'Gespeicherte Daten löschen' });
  }

  get breadcrumbs(): Locator {
    return this.page.locator('app-breadcrumbs');
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async clearPersistedForm(): Promise<void> {
    await this.deleteStoredDataButton.click();
  }

  async expectBreadcrumbTrail(items: readonly string[]): Promise<void> {
    for (const item of items) {
      await expect(this.breadcrumbs.getByRole('link', { name: item })).toBeVisible();
    }
  }
}
