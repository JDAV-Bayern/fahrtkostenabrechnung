import { AuthService } from '@/app/auth/auth-service';
import { Button } from '@/app/shared/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';
import { FeedbackService } from '../feedback-service';

@Component({
  selector: 'jdav-feedback',
  imports: [
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    RouterLink,
    SurveyModule,
  ],
  templateUrl: './feedback.html',
})
export class Feedback implements OnInit {
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly feedbackService = inject(FeedbackService);

  readonly token = input<string>();
  readonly courseId = input<string>();

  surveyModel = signal<Model | null>(null);
  error = signal<string | null>(null);
  feedbackId = signal<string>('');

  private readonly correlationId = crypto.randomUUID();

  constructor() {
    effect(() => {
      if (
        !this.token() &&
        !this.courseId() &&
        this.authService.isAuthenticated()
      ) {
        this.router.navigate(['/meine-kurse']);
      }
    });
  }

  saveSurveyResults(sender: Model) {
    const token = this.token();
    const courseId = this.courseId();

    if (!token && !courseId) {
      return;
    }
    const payload = {
      feedback_id: this.feedbackId(),
      feedback: sender.data,
      correlation_id: this.correlationId,
    };

    const createFeedback$ = token
      ? this.feedbackService.createFeedbackRecordByToken(payload, token)
      : this.feedbackService.createFeedbackRecord(payload, courseId!);

    createFeedback$.subscribe({
      error: (error) => {
        console.error('Fehler beim Speichern der Feedback-Antworten: ', error);
        this.error.set(
          'Fehler beim Speichern der Feedback-Antworten: ' + error.message,
        );
      },
    });
  }

  ngOnInit() {
    const token = this.token();
    const courseId = this.courseId();

    if (!token && !courseId) {
      return;
    }

    const feedback$ = token
      ? this.feedbackService.getFeedbackByToken(token)
      : this.feedbackService.getFeedbackByCourseId(courseId!);

    feedback$.subscribe({
      next: (feedback) => {
        this.feedbackId.set(feedback.id);
        this.initializeSurvey(feedback.surveyJson);
      },
      error: (error) => {
        if (error.status === 401) {
          this.error.set('Ungültiger oder abgelaufener Token.');
        } else if (error.status === 404) {
          this.error.set(
            'Kein Feedback für die angegebene Schulungsnummer gefunden. Es kann sein, dass noch kein Feedback für diese Schulung erstellt wurde. Komm gerne später wieder.',
          );
        } else {
          console.error('Fehler beim Abrufen des Feedbacks: ', error);
          this.error.set('Fehler beim Abrufen des Feedbacks: ' + error.message);
        }
      },
    });
  }

  initializeSurvey(surveyJson: unknown) {
    const survey = new Model(surveyJson);
    survey.onComplete.add((sender) => this.saveSurveyResults(sender));
    survey.onCurrentPageChanged.add((sender, options) => {
      if (options.isNextPage) {
        this.saveSurveyResults(sender);
      }
    });

    this.surveyModel.set(survey);
  }
}
