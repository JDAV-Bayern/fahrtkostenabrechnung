import { Component, inject, signal } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';

import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import 'survey-core/survey-core.min.css';
import { FeedbackService } from '../feedback-service';

@Component({
  selector: 'jdav-feedback',
  imports: [SurveyModule, A11yModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  surveyModel = signal<Model | null>(null);
  error = signal<string | null>(null);
  feedbackId = signal<string>('');
  feedbackService: FeedbackService = inject(FeedbackService);
  router = inject(Router);

  saveSurveyResults(sender: { data: any }) {
    this.feedbackService
      .createFeedbackRecord(
        {
          feedback_id: this.feedbackId(),
          feedback: sender.data,
        },
        this.getTokenFromUrl(),
      )
      .subscribe({
        error: (error) => {
          console.error(
            'Fehler beim Speichern der Feedback-Antworten: ',
            error,
          );
          this.error.set(
            'Fehler beim Speichern der Feedback-Antworten: ' + error.message,
          );
        },
      });
  }

  ngOnInit() {
    this.feedbackService.getFeedbackByToken(this.getTokenFromUrl()).subscribe({
      next: (feedback) => {
        this.feedbackId.set(feedback.id);
        this.initializeSurvey(feedback.surveyJson);
      },
      error: (error) => {
        if (error.status === 401) {
          this.error.set('Ungültiger oder abgelaufener Token.');
        } else {
          console.error('Fehler beim Abrufen des Feedbacks: ', error);
          this.error.set('Fehler beim Abrufen des Feedbacks: ' + error.message);
        }
      },
    });
  }
  initializeSurvey(surveyJson: unknown) {
    const survey = new Model(surveyJson);
    survey.onComplete.add((sender: { data: any }) =>
      this.saveSurveyResults(sender),
    );
    this.surveyModel.set(survey);
  }
  getTokenFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  }
}
