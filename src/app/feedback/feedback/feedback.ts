import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';

import { A11yModule } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import { Observer } from 'rxjs';
import { FeedbackDTO, FeedbackService } from '../feedback-service';

@Component({
  selector: 'jdav-feedback',
  imports: [SurveyModule, A11yModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback implements OnInit, OnDestroy {
  surveyModel = signal<Model | null>(null);
  error = signal<string | null>(null);
  feedbackId = signal<string>('');
  feedbackService: FeedbackService = inject(FeedbackService);
  router = inject(Router);
  private resizeListener: (() => void) | null = null;

  saveSurveyResults(sender: { data: unknown }) {
    const { token, courseId } = this.getUrlParameter();
    if (!token && !courseId) {
      this.error.set('Weder Token noch Schulungsnummer angegeben.');
      return;
    }
    (token
      ? this.feedbackService.createFeedbackRecordByToken(
          {
            feedback_id: this.feedbackId(),
            feedback: sender.data,
          },
          token,
        )
      : this.feedbackService.createFeedbackRecord(
          {
            feedback_id: this.feedbackId(),
            feedback: sender.data,
          },
          courseId!,
        )
    ).subscribe({
      error: (error) => {
        console.error('Fehler beim Speichern der Feedback-Antworten: ', error);
        this.error.set(
          'Fehler beim Speichern der Feedback-Antworten: ' + error.message,
        );
      },
    });
  }

  ngOnInit() {
    const { token, courseId } = this.getUrlParameter();

    if (!token && !courseId) {
      this.error.set('Weder Token noch Schulungsnummer angegeben.');
      return;
    }
    const feedbackInitializerSubscription: Partial<Observer<FeedbackDTO>> = {
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
    };

    if (token) {
      this.feedbackService
        .getFeedbackByToken(token)
        .subscribe(feedbackInitializerSubscription);
    } else if (courseId) {
      this.feedbackService
        .getFeedbackByCourseId(courseId)
        .subscribe(feedbackInitializerSubscription);
    }
  }

  getUrlParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      token: urlParams.get('token'),
      courseId: urlParams.get('schulungsnummer'),
    };
  }

  initializeSurvey(surveyJson: unknown) {
    const survey = new Model(surveyJson);
    survey.onComplete.add((sender: { data: unknown }) =>
      this.saveSurveyResults(sender),
    );
    const setContainerWidth = () => {
      const container = document.getElementById('feedback-container');
      if (!container) return;
      const width = Math.min(window.innerWidth, 1200);
      container.style.width = `${width}px`;
      container.style.margin = '0 auto';
    };

    survey.onAfterRenderSurvey.add(() => {
      setContainerWidth();
    });
    survey.onAfterRenderPage.add(setContainerWidth);

    this.resizeListener = () => setContainerWidth();
    window.addEventListener('resize', this.resizeListener);

    this.surveyModel.set(survey);
  }
  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
