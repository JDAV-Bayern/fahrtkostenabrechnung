import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {
  FeedbackAccessTokenDTO,
  FeedbackDTO,
  FeedbackService,
} from '../feedback-service';

@Component({
  selector: 'jdav-feedback-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-admin.html',
  styleUrl: './feedback-admin.css',
})
export class FeedbackAdmin implements OnInit {
  feedbackService: FeedbackService = inject(FeedbackService);
  feedbacks = signal<FeedbackDTO[]>([]);
  selectedFeedback = signal<FeedbackDTO | null>(null);
  tokens = signal<FeedbackAccessTokenDTO[]>([]);
  newTokenRole = 'give_feedback';

  newFeedbackCourseId = '';
  newFeedbackCourseName = '';
  newFeedbackTeamers = '';

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  showCreateForm = signal<boolean>(false);

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.loading.set(true);
    this.error.set(null);
    this.feedbackService.listFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks.set(feedbacks);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Fehler beim Laden der Feedbacks: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  selectFeedback(feedback: FeedbackDTO): void {
    this.selectedFeedback.set(feedback);
    this.loadTokens(feedback.id);
  }

  loadTokens(feedbackId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.feedbackService.listFeedbackTokens(feedbackId).subscribe({
      next: (tokens) => {
        this.tokens.set(tokens);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Fehler beim Laden der Tokens: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  createToken(): void {
    if (!this.selectedFeedback()) return;

    this.loading.set(true);
    this.error.set(null);
    this.feedbackService
      .createFeedbackToken(this.selectedFeedback()!.id, this.newTokenRole)
      .subscribe({
        next: (token) => {
          this.tokens.update((tokens) => [...tokens, token]);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Fehler beim Erstellen des Tokens: ' + error.message);
          this.loading.set(false);
        },
      });
  }

  deleteToken(tokenId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.feedbackService.deleteFeedbackToken(tokenId).subscribe({
      next: () => {
        this.tokens.update((tokens) =>
          tokens.filter((token: any) => token.id !== tokenId),
        );
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Fehler beim Löschen des Tokens: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm.set(!this.showCreateForm());
    // Reset form fields when toggling
    if (!this.showCreateForm()) {
      this.resetCreateForm();
    }
  }

  resetCreateForm(): void {
    this.newFeedbackCourseId = '';
    this.newFeedbackCourseName = '';
    this.newFeedbackTeamers = '';
    this.error.set(null);
  }

  createFeedback(): void {
    if (!this.newFeedbackCourseId || !this.newFeedbackCourseName) {
      this.error.set('Bitte füll alle Pflichtfelder aus.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Convert teamers string to array
    const teamersArray = this.newFeedbackTeamers
      .split(',')
      .map((teamer) => teamer.trim())
      .filter((teamer) => teamer.length > 0);

    const feedbackCreateDTO = {
      course_id: this.newFeedbackCourseId,
      course_name: this.newFeedbackCourseName,
      teamers: teamersArray,
      surveyJson: {}, // Empty survey JSON for now
    };

    this.feedbackService.createFeedback(feedbackCreateDTO).subscribe({
      next: (feedback) => {
        // Add the new feedback to the list
        this.feedbacks.update((feedbacks) => [...feedbacks, feedback]);
        this.loading.set(false);
        // Hide the form and reset it
        this.showCreateForm.set(false);
        this.resetCreateForm();
      },
      error: (error) => {
        this.error.set('Fehler beim Erstellen des Feedbacks: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  feedbackLink(token: FeedbackAccessTokenDTO): string {
    return `${environment.origin}/feedback?query=${token.token}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch((err) => {
      this.error.set('Fehler beim Kopieren in die Zwischenablage: ' + err);
    });
  }
}
