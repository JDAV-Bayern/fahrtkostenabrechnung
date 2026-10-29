import { Locator, Page } from '@playwright/test';
import { Meal } from 'src/domain/expense.model';
import {
  MaterialExpenseInput,
  MaterialExpenseModal,
} from './material-expense.modal';
import { ReimbursementStepPage } from './reimbursement-step.page';

const MEAL_LABEL: Record<Meal, string> = {
  breakfast: 'Frühstück',
  lunch: 'Mittagessen',
  dinner: 'Abendessen',
};

export class ExpensesExtraStepPage extends ReimbursementStepPage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/auslagen-gremium');
  }

  get enablePerDiemButton(): Locator {
    return this.page.getByRole('button', { name: 'Tagegelder abrechnen' });
  }

  get disablePerDiemButton(): Locator {
    return this.page.getByRole('button', { name: 'Tagegelder entfernen' });
  }

  get foodCards(): Locator {
    return this.page.locator('app-food-expense-card');
  }

  get totalRequiredError(): Locator {
    return this.page.getByText('Der Erstattungsbetrag darf nicht 0 € betragen');
  }

  subtotal(label: 'Fahrkosten' | 'Tagegelder' | 'Sachkosten' | 'Summe') {
    return this.page.locator('p.subtotal').filter({ hasText: label });
  }

  mealCheckbox(cardIndex: number, meal: Meal): Locator {
    return this.foodCards.nth(cardIndex).getByLabel(MEAL_LABEL[meal]);
  }

  private materialSection(): Locator {
    return this.page
      .locator('app-expense-list')
      .filter({
        has: this.page.getByRole('heading', { name: 'Sonstige Auslagen' }),
      })
      .first();
  }

  async enablePerDiem(): Promise<void> {
    await this.enablePerDiemButton.click();
  }

  async disablePerDiem(): Promise<void> {
    await this.disablePerDiemButton.click();
  }

  async toggleMealAllowance(cardIndex: number, meal: Meal): Promise<void> {
    const card = this.foodCards.nth(cardIndex);
    await card.getByLabel(MEAL_LABEL[meal]).click();
  }

  async addMaterialExpense(expense: MaterialExpenseInput): Promise<void> {
    const section = this.materialSection();
    await section.getByRole('button', { name: 'Auslage hinzufügen' }).click();

    const modal = new MaterialExpenseModal(this.page);
    await modal.waitForOpen();
    await modal.fill(expense);
    await modal.submit();
  }
}
