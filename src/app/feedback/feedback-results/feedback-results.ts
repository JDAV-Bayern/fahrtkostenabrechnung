import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FeedbackDTO,
  FeedbackRecordDTO,
  FeedbackService,
} from '../feedback-service';

@Component({
  selector: 'jdav-feedback-results',
  imports: [],
  templateUrl: './feedback-results.html',
  styleUrl: './feedback-results.css',
})
export class FeedbackResults implements OnInit {
  feedbackService = inject(FeedbackService);

  feedback = signal<FeedbackDTO | null>(null);
  results = signal<FeedbackRecordDTO[] | null>(null);
  chartTypes = signal<Record<string, 'histogram' | 'pie'>>({});

  json = JSON;

  private colorPalette = [
    '#10b981',
    '#ef4444',
    '#2563eb',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#22d3ee',
  ];

  result_order = signal<
    (
      | {
          type: 'histogram';
          title: string;
          key: string;
          labelMap: { value: string; text: string }[];
        }
      | {
          type: 'text';
          title: string;
          key: string;
        }
    )[]
  >([]);

  ngOnInit() {
    this.feedbackService.listFeedbackRecords(this.getTokenFromUrl()).subscribe({
      next: (feedback) => {
        this.results.set(feedback);
        this.makeResultOrder();
      },
      error: (error) => {
        console.error('Fehler beim Abrufen des Feedbacks: ', error);
      },
    });
    this.feedbackService.getFeedbackByToken(this.getTokenFromUrl()).subscribe({
      next: (feedback) => {
        this.feedback.set(feedback);
        this.makeResultOrder();
      },
      error: (error) => {
        console.error('Fehler beim Abrufen des Feedbacks: ', error);
      },
    });
  }

  getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }

  getNestedValue(obj: unknown, key: string): unknown {
    return key.split('.').reduce((obj, k) => {
      if (obj && typeof obj === 'object' && obj !== null && k in obj) {
        return (obj as Record<string, unknown>)[k];
      }
      return undefined;
    }, obj);
  }

  getHistogramData(key: string): Record<string, number> {
    const data: Record<string, number> = {};
    for (const result of this.results() || []) {
      // Keys might be nested, e.g., "section1.question2"
      const feedbackData = result.feedback;
      const value = this.getNestedValue(feedbackData, key);
      if (value !== undefined) {
        data[String(value)] = (data[String(value)] || 0) + 1;
      }
    }
    return data;
  }

  getHistogramSum(data: Record<string, number>): number {
    return Object.values(data).reduce((a, b) => a + b, 0);
  }

  getChartType(key: string): 'histogram' | 'pie' {
    return this.chartTypes()[key] ?? 'histogram';
  }

  setChartType(key: string, type: 'histogram' | 'pie') {
    this.chartTypes.update((current) => ({
      ...current,
      [key]: type,
    }));
  }

  toggleChartType(key: string) {
    const next = this.getChartType(key) === 'histogram' ? 'pie' : 'histogram';
    this.setChartType(key, next);
  }

  getLabelColor(index: number): string {
    return this.colorPalette[index % this.colorPalette.length];
  }

  getPieGradient(
    key: string,
    labelMap: { value: string; text: string }[],
  ): string {
    const data = this.getHistogramData(key);
    const total = this.getHistogramSum(data);
    if (total === 0) {
      return '#e5e7eb';
    }

    let startAngle = 0;
    const segments: string[] = [];

    labelMap.forEach((label, index) => {
      const value = data[label.value] || 0;
      if (value === 0) {
        return;
      }
      const sliceAngle = (value / total) * 360;
      const endAngle = startAngle + sliceAngle;
      segments.push(
        `${this.getLabelColor(index)} ${startAngle}deg ${endAngle}deg`,
      );
      startAngle = endAngle;
    });

    return segments.length > 0
      ? `conic-gradient(${segments.join(', ')})`
      : '#e5e7eb';
  }

  getTextAnswers(key: string): string[] {
    const answers: string[] = [];
    for (const result of this.results() || []) {
      const feedbackData = result.feedback;
      const value = this.getNestedValue(feedbackData, key);
      if (typeof value === 'string' && value.trim() !== '') {
        answers.push(value);
      }
    }
    return answers;
  }

  getAllFeedbackElements(feedback: unknown): Record<string, unknown>[] {
    if (typeof feedback !== 'object' || feedback === null) {
      return [];
    }

    const fb = feedback as Record<string, unknown>;

    if ('pages' in fb && Array.isArray(fb['pages'])) {
      return fb['pages']
        .map((page: unknown) => this.getAllFeedbackElements(page))
        .flat();
    }
    if ('elements' in fb && Array.isArray(fb['elements'])) {
      return fb['elements']
        .map((element: unknown) => this.getAllFeedbackElements(element))
        .flat();
    }
    if (
      'type' in fb &&
      typeof fb['type'] === 'string' &&
      ['radiogroup', 'boolean', 'comment', 'matrix', 'text'].includes(
        fb['type'] as string,
      )
    ) {
      return [fb];
    }
    return [];
  }

  makeResultOrder() {
    const results = this.results();
    const feedback = this.feedback();
    if (!results || !feedback) {
      return;
    }

    const allFeedbackElements: Record<string, unknown>[] =
      this.getAllFeedbackElements(feedback.surveyJson);

    this.result_order.set(
      allFeedbackElements
        .map((element: Record<string, unknown>) => {
          if (element['type'] === 'matrix') {
            if (
              !Array.isArray(element['rows']) ||
              !Array.isArray(element['columns']) ||
              typeof element['title'] !== 'string' ||
              typeof element['name'] !== 'string'
            ) {
              throw new Error('Invalid matrix element structure');
            }
            return element['rows'].map((row: unknown) => {
              if (
                typeof row !== 'object' ||
                row === null ||
                !('text' in row) ||
                !('value' in row) ||
                typeof row['text'] !== 'string' ||
                typeof row['value'] !== 'string'
              ) {
                throw new Error('Invalid row structure in matrix element');
              }
              return {
                type: 'histogram' as const,
                title: row['text'] as string,
                key: `${element['name']}.${row['value']}`,
                labelMap: element['columns'] as {
                  value: string;
                  text: string;
                }[],
              };
            });
          }
          if (element['type'] === 'boolean') {
            return {
              type: 'histogram' as const,
              title: (element['title'] as string) ?? '',
              key: element['name'] as string,
              labelMap: [
                {
                  value: 'true',
                  text: (element['labelTrue'] as string) ?? 'Ja',
                },
                {
                  value: 'false',
                  text: (element['labelFalse'] as string) ?? 'Nein',
                },
              ],
            };
          }
          if (element['type'] === 'radiogroup') {
            return {
              type: 'histogram' as const,
              title: (element['title'] as string) ?? '',
              key: element['name'] as string,
              labelMap: element['choices'] as { value: string; text: string }[],
            };
          }
          if (element['type'] === 'comment' || element['type'] === 'text') {
            return {
              type: 'text' as const,
              title: (element['title'] as string) ?? '',
              key: element['name'] as string,
            };
          }
          console.error('Unsupported element type:', element);
          throw new Error(
            `Unsupported element type in result order generation.`,
          );
        })
        .flat(),
    );
  }
}
