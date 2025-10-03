import { Locator, Page } from '@playwright/test';
import { Discount, EngineType, TransportMode } from 'src/domain/expense.model';

export interface BaseTransportExpenseInput {
  origin: string;
  destination: string;
}

export interface CarExpenseInput extends BaseTransportExpenseInput {
  mode: 'car';
  distance: number;
  engineType?: EngineType;
  passengers?: string[];
}

export interface BikeExpenseInput extends BaseTransportExpenseInput {
  mode: 'bike';
  distance: number;
}

export interface PublicTransportExpenseInput extends BaseTransportExpenseInput {
  mode: 'public';
  price: number;
  discount?: Discount;
}

export interface PublicTransportPlanExpenseInput
  extends BaseTransportExpenseInput {
  mode: 'plan';
}

export type TransportExpenseInput =
  | CarExpenseInput
  | BikeExpenseInput
  | PublicTransportExpenseInput
  | PublicTransportPlanExpenseInput;

const MODE_LABEL: Record<TransportMode, string> = {
  car: 'Autofahrt',
  public: 'Fahrt mit ÖPNV',
  plan: 'Fahrt mit ÖPNV-Abo',
  bike: 'Fahrradfahrt',
};

export class TransportExpenseModal {
  private readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('app-transport-expense-modal');
  }

  get saveButton(): Locator {
    return this.root.getByRole('button', { name: 'Speichern' });
  }

  async waitForOpen(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
  }

  async chooseMode(mode: TransportMode): Promise<void> {
    const label = MODE_LABEL[mode];
    const selectorButton = this.root.getByRole('button', { name: label });
    if (await selectorButton.isVisible()) {
      await selectorButton.click();
    }
  }

  async fill(expense: TransportExpenseInput): Promise<void> {
    await this.chooseMode(expense.mode);
    await this.root.getByLabel('Von').fill(expense.origin);
    await this.root.getByLabel('Nach').fill(expense.destination);

    if ('distance' in expense) {
      await this.root.locator('#distance').fill(String(expense.distance));
    }

    if (expense.mode === 'public') {
      await this.root.locator('#price').fill(String(expense.price));
      if (expense.discount) {
        await this.root.locator('#discount').selectOption(expense.discount);
      }
    }

    if (expense.mode === 'car') {
      if (expense.engineType) {
        await this.root.locator('#engineType').selectOption(expense.engineType);
      }
      if (expense.passengers?.length) {
        for (const passenger of expense.passengers) {
          await this.root
            .getByRole('button', { name: 'Mitfahrer*in hinzufügen' })
            .click();
          await this.page.waitForTimeout(100); // wait for animation
          const passengerInput = this.root.getByLabel('Mitfahrer*in').last();
          await passengerInput.fill(passenger);
        }
      }
    }
  }

  async submit(): Promise<void> {
    await Promise.all([this.saveButton.click()]);
  }
}
