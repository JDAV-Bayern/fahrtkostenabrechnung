import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { MeetingType } from 'src/domain/meeting.model';
import { environment } from 'src/environments/environment';
import { ExpenseConfig } from '../expense.config';

export interface PublicTransportExpenseDTO {
  none: number;
  BC25: number;
  BC50: number;
}

export interface TransportExpenseConfigDTO {
  car: number[];
  public: PublicTransportExpenseDTO;
  bike: number;
  plan: number;
}

export interface FoodExpenseConfigDTO {
  arrival: number;
  full: number;
  departure: number;
  single_day: number;
}

export interface ExpenseConfigDTO {
  allowed: ExpenseConfig['allowed'];
  valid_from?: string;
  transport: TransportExpenseConfigDTO;
  food: FoodExpenseConfigDTO;
  maxTotal?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseConfigService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.backendUrl ?? '/api';
  private readonly cache = new Map<MeetingType, Observable<ExpenseConfig>>();

  getConfig(
    type: MeetingType,
    date: Date | undefined = undefined,
  ): Observable<ExpenseConfig> {
    const cached = this.cache.get(type);
    if (cached && !date) {
      return cached;
    }

    const query = date
      ? `?date=${[
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, '0'),
          String(date.getDate()).padStart(2, '0'),
        ].join('-')}`
      : '';

    const request = this.http
      .get<ExpenseConfigDTO>(
        `${this.baseUrl}/reimbursement-config/${type}${query}`,
      )
      .pipe(
        map((config) => this.normalizeConfig(config)),
        shareReplay(1),
      );
    if (!date) {
      this.cache.set(type, request);
    }
    return request;
  }

  getCurrentConfig(type: MeetingType): Observable<ExpenseConfigDTO> {
    return this.http.get<ExpenseConfigDTO>(
      `${this.baseUrl}/reimbursement-config/${type}`,
    );
  }

  updateConfig(type: MeetingType, config: ExpenseConfigDTO): Observable<void> {
    config.valid_from = new Date().toISOString();
    return this.http
      .post<void>(`${this.baseUrl}/reimbursement-config/${type}`, config)
      .pipe(tap(() => this.cache.delete(type)));
  }

  private normalizeConfig(config: ExpenseConfigDTO): ExpenseConfig {
    return {
      allowed: config.allowed,
      transport: config.transport,
      food: config.food
        ? {
            arrival: config.food.arrival,
            return: config.food.departure,
            intermediate: config.food.full,
            single: config.food.single_day,
          }
        : undefined,
      maxTotal: config.maxTotal ?? undefined,
    };
  }
}
