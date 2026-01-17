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
import * as QRCode from 'qrcode';
import { Button } from 'src/app/shared/ui/button';
import { environment } from 'src/environments/environment';
import {
  FeedbackAccessTokenDTO,
  FeedbackDTO,
  FeedbackService,
} from '../feedback-service';
import { QrPdfViewComponent } from './qr-pdf-view/qr-pdf-view.component';
const MIME_TYPE_PDF = 'application/pdf';

@Component({
  selector: 'jdav-feedback-admin',
  standalone: true,
  imports: [Button, CommonModule, FormsModule, QrPdfViewComponent],
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
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/']);
        }
        this.error.set('Fehler beim Laden der Feedbacks: ' + error.message);
        this.loading.set(false);
      },
    });
  }

  selectFeedback(feedback: FeedbackDTO): void {
    this.selectedFeedback.set(feedback);
    this.newTokenTeamer = '';
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

  openQrCode(token: FeedbackAccessTokenDTO): void {
    const qrTarget = this.feedbackLink(token);
    const newTab = window.open('', '_blank');

    if (!newTab) {
      this.error.set('QR-Code konnte nicht in neuem Tab geöffnet werden.');
      return;
    }

    QRCode.toDataURL(qrTarget, { scale: 8 })
      .then((dataUrl: string) => {
        newTab.document.title =
          token.course_id + ' ' + this.roleToGerman(token.role);
        newTab.document.body.style.margin = '0';
        // Remove all children from the body
        while (newTab.document.body.firstChild) {
          newTab.document.body.removeChild(newTab.document.body.firstChild);
        }
        const img = newTab.document.createElement('img');
        img.setAttribute('src', dataUrl);
        img.setAttribute('alt', 'QR Code');
        img.setAttribute('style', 'width:100%;height:100%;object-fit:none;');
        newTab.document.body.appendChild(img);
        newTab.opener = null;
      })
      .catch((err: unknown) => {
        newTab.close();
        this.error.set('Fehler beim Erstellen des QR-Codes: ' + err);
      });
  }

  async downloadPdf(token: FeedbackAccessTokenDTO): Promise<void> {
    // create container
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
    compRef.setInput('courseName', this.selectedFeedback()!.course_name);
    compRef.setInput('courseId', this.selectedFeedback()!.course_id);
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
        const fileName = `Feedback_QR_${this.selectedFeedback()!.course_id}_${this.roleToGerman(
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
