import { CommonModule } from '@angular/common';
import {
  ApplicationRef,
  Component,
  createComponent,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import {
  FeedbackAccessTokenDTO,
  FeedbackDTO,
  FeedbackService,
} from 'src/app/feedback/feedback-service';
import { Button } from 'src/app/shared/ui/button';
import { environment } from 'src/environments/environment';
import { QrPdfViewComponent } from './qr-pdf-view/qr-pdf-view.component';
const MIME_TYPE_PDF = 'application/pdf';

@Component({
  selector: 'jdav-feedback-admin',
  standalone: true,
  imports: [Button, CommonModule, FormsModule],
  templateUrl: './feedback-admin.html',
  styleUrl: './feedback-admin.css',
})
export class FeedbackAdmin implements OnInit {
  router = inject(Router);
  feedbackService: FeedbackService = inject(FeedbackService);
  appRef: ApplicationRef = inject(ApplicationRef);
  feedbacks = signal<FeedbackDTO[]>([]);
  selectedFeedback = signal<FeedbackDTO | null>(null);
  tokens = signal<FeedbackAccessTokenDTO[]>([]);
  newTokenRole = 'give_feedback';
  newTokenTeamer = '';

  newFeedbackCourseId = '';
  newFeedbackCourseName = '';
  newFeedbackTeamers = '';

  showTeamersEditor = signal<boolean>(false);
  editTeamersText = '';

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
        const sortedFeedbacks = [...feedbacks].sort((a, b) =>
          a.course_id.localeCompare(b.course_id, 'de'),
        );
        this.feedbacks.set(sortedFeedbacks);
        this.loading.set(false);
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/']);
        }
        this.error.set('Fehler beim Laden der Feedbacks: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  selectFeedback(feedback: FeedbackDTO): void {
    if (this.selectedFeedback()?.id === feedback.id) {
      this.selectedFeedback.set(null);
      this.tokens.set([]);
      this.showTeamersEditor.set(false);
      this.editTeamersText = '';
      return;
    }

    this.selectedFeedback.set(feedback);
    this.newTokenTeamer = '';
    this.showTeamersEditor.set(false);
    this.editTeamersText = feedback.teamers.join(', ');
    this.loadTokens(feedback.id);
  }

  loadTokens(feedbackId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.tokens.set([]);
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
    const teamerName =
      this.newTokenRole === 'give_feedback'
        ? undefined
        : this.newTokenTeamer || undefined;
    this.feedbackService
      .createFeedbackToken(
        this.selectedFeedback()!.id,
        this.newTokenRole,
        teamerName,
      )
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
          tokens.filter(
            (token: FeedbackAccessTokenDTO) => token.id !== tokenId,
          ),
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
    return `${environment.origin}/${token.role === 'give_feedback' ? 'feedback' : 'feedback-ergebnisse'}?token=${token.token}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).catch((err) => {
      this.error.set('Fehler beim Kopieren in die Zwischenablage: ' + err);
    });
  }

  roleToGerman(role: string): string {
    switch (role) {
      case 'give_feedback':
        return 'Feedback geben';
      case 'get_feedback':
        return 'Ergebnisse ansehen';
      default:
        return role;
    }
  }

  tokenTeamerLabel(token: FeedbackAccessTokenDTO): string {
    if (token.teamer_name && token.teamer_name.trim()) {
      return `Teamer*in: ${token.teamer_name}`;
    }
    return 'Alle Teamer*innen';
  }

  onTokenRoleChange(role: string): void {
    this.newTokenRole = role;
    if (role === 'give_feedback') {
      this.newTokenTeamer = '';
    }
  }

  toggleTeamersEditor(): void {
    const next = !this.showTeamersEditor();
    this.showTeamersEditor.set(next);
    if (next && this.selectedFeedback()) {
      this.editTeamersText = this.selectedFeedback()!.teamers.join(', ');
    }
  }

  saveTeamers(): void {
    const feedback = this.selectedFeedback();
    if (!feedback) return;

    const teamersArray = this.editTeamersText
      .split(',')
      .map((teamer) => teamer.trim())
      .filter((teamer) => teamer.length > 0);

    this.loading.set(true);
    this.error.set(null);
    this.feedbackService
      .updateFeedbackTeamers(feedback.id, teamersArray)
      .subscribe({
        next: (updatedFeedback) => {
          this.feedbacks.update((feedbacks) =>
            feedbacks.map((item) =>
              item.id === updatedFeedback.id ? updatedFeedback : item,
            ),
          );
          this.selectedFeedback.set(updatedFeedback);
          this.editTeamersText = updatedFeedback.teamers.join(', ');
          this.showTeamersEditor.set(false);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(
            'Fehler beim Aktualisieren der Teamer*innen: ' + error.message,
          );
          this.loading.set(false);
        },
      });
  }

  async downloadPdf(token: FeedbackAccessTokenDTO): Promise<void> {
    // create container
    const feedback = this.selectedFeedback();
    if (!feedback) return;

    const container = document.createElement('div');
    container.id = 'jdav-pdf-container';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // create component
    const compRef = createComponent(QrPdfViewComponent, {
      environmentInjector: this.appRef.injector,
    });
    container.appendChild(compRef.location.nativeElement);
    this.appRef.attachView(compRef.hostView);
    compRef.setInput('link', this.feedbackLink(token));
    compRef.setInput('courseName', feedback.course_name);
    compRef.setInput('courseId', feedback.course_id);
    compRef.setInput('qrCodeType', token.role);
    compRef.setInput('teamerName', token.teamer_name);
    await new Promise<void>((resolve) => {
      compRef.instance.fullyRendered.subscribe(async () => {
        const doc = new jsPDF({
          unit: 'pt',
          compress: true,
        });

        // Add the form content
        await doc.html(compRef.location.nativeElement, {
          autoPaging: true,
        });

        const fileURL = URL.createObjectURL(
          new Blob([new Uint8Array(doc.output('arraybuffer'))], {
            type: MIME_TYPE_PDF,
          }),
        );
        const fileName = `Feedback_QR_${feedback.course_id}_${this.roleToGerman(
          token.role,
        ).replace(/ /g, '_')}.pdf`;
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = fileName;
        link.click();
        compRef.destroy();
        container.remove();
        resolve();
      });
    });
  }
}
