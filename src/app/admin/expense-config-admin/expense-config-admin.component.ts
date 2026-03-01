import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ExpenseConfigDTO,
  ExpenseConfigService,
} from 'src/app/reimbursement/expenses/shared/expense-config.service';
import { Button } from 'src/app/shared/ui/button';
import { ExpenseType } from 'src/domain/expense.model';
import { MeetingType } from 'src/domain/meeting.model';

@Component({
  selector: 'jdav-expense-config-admin',
  standalone: true,
  imports: [Button, CommonModule, FormsModule],
  templateUrl: './expense-config-admin.component.html',
  styleUrl: './expense-config-admin.component.css',
})
export class ExpenseConfigAdminComponent implements OnInit {
  private readonly expenseConfigService = inject(ExpenseConfigService);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly config = signal<ExpenseConfigDTO | null>(null);

  selectedType: MeetingType = 'course';

  ngOnInit(): void {
    this.loadConfig(this.selectedType);
  }

  selectType(type: MeetingType): void {
    if (this.selectedType === type) {
      return;
    }

    this.selectedType = type;
    this.loadConfig(type);
  }

  loadConfig(type: MeetingType): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.expenseConfigService.getCurrentConfig(type).subscribe({
      next: (config) => {
        this.config.set(this.cloneConfig(config));
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(
          'Fehler beim Laden der Erstattungssätze: ' + error.message,
        );
        this.loading.set(false);
      },
    });
  }

  isAllowed(expenseType: ExpenseType): boolean {
    return this.config()?.allowed.includes(expenseType) ?? false;
  }

  toggleAllowed(expenseType: ExpenseType, enabled: boolean): void {
    const config = this.config();
    if (!config) {
      return;
    }

    const allowed = enabled
      ? [...new Set([...config.allowed, expenseType])]
      : config.allowed.filter((entry) => entry !== expenseType);

    this.config.set({
      ...config,
      allowed: this.sortAllowed(allowed),
    });
  }

  updateCarRate(index: number, value: number | string | null): void {
    const config = this.config();
    if (!config) {
      return;
    }

    const car = [...config.transport.car];
    car[index] = this.toNumber(value);
    this.config.set({
      ...config,
      transport: {
        ...config.transport,
        car,
      },
    });
  }

  addCarRate(): void {
    const config = this.config();
    if (!config) {
      return;
    }

    this.config.set({
      ...config,
      transport: {
        ...config.transport,
        car: [...config.transport.car, 0],
      },
    });
  }

  removeCarRate(index: number): void {
    const config = this.config();
    if (!config || config.transport.car.length <= 1) {
      return;
    }

    this.config.set({
      ...config,
      transport: {
        ...config.transport,
        car: config.transport.car.filter(
          (_, currentIndex) => currentIndex !== index,
        ),
      },
    });
  }

  saveConfig(): void {
    const config = this.config();
    if (!config) {
      return;
    }

    const sanitized = this.sanitizeConfig(config);
    this.saving.set(true);
    this.error.set(null);
    this.success.set(null);

    this.expenseConfigService
      .updateConfig(this.selectedType, sanitized)
      .subscribe({
        next: () => {
          this.config.set(this.cloneConfig(sanitized));
          this.success.set('Erstattungssätze gespeichert.');
          this.saving.set(false);
        },
        error: (error) => {
          this.error.set(
            'Fehler beim Speichern der Erstattungssätze: ' + error.message,
          );
          this.saving.set(false);
        },
      });
  }

  private sanitizeConfig(config: ExpenseConfigDTO): ExpenseConfigDTO {
    return {
      allowed: this.sortAllowed([...config.allowed]),
      valid_from: config.valid_from || undefined,
      maxTotal:
        config.maxTotal === null || config.maxTotal === undefined
          ? null
          : this.toNumber(config.maxTotal),
      transport: {
        car: config.transport.car.map((entry) => this.toNumber(entry)),
        public: {
          none: this.toNumber(config.transport.public.none),
          BC25: this.toNumber(config.transport.public.BC25),
          BC50: this.toNumber(config.transport.public.BC50),
        },
        bike: this.toNumber(config.transport.bike),
        plan: this.toNumber(config.transport.plan),
      },
      food: {
        arrival: this.toNumber(config.food.arrival),
        full: this.toNumber(config.food.full),
        departure: this.toNumber(config.food.departure),
        single_day: this.toNumber(config.food.single_day),
      },
    };
  }

  private cloneConfig(config: ExpenseConfigDTO): ExpenseConfigDTO {
    return {
      allowed: [...config.allowed],
      valid_from: config.valid_from,
      maxTotal: config.maxTotal ?? null,
      transport: {
        car: [...config.transport.car],
        public: { ...config.transport.public },
        bike: config.transport.bike,
        plan: config.transport.plan,
      },
      food: {
        ...config.food,
      },
    };
  }

  private sortAllowed(allowed: ExpenseType[]): ExpenseType[] {
    const order: ExpenseType[] = ['transport', 'food', 'material'];
    return order.filter((entry) => allowed.includes(entry));
  }

  private toNumber(value: number | string | null | undefined): number {
    return Number(value ?? 0) || 0;
  }
}
