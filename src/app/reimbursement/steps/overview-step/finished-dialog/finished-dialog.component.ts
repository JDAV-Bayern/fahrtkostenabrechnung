import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import {
  buildReimbursementMail,
  toMailtoHref,
} from 'src/app/shared/reimbursement-mail';
import { Button } from 'src/app/shared/ui/button';
import { Meeting } from 'src/domain/meeting.model';

type CopyField = 'to' | 'subject' | 'body';

@Component({
  selector: 'app-finished-dialog',
  imports: [Button],
  templateUrl: './finished-dialog.component.html',
  styleUrls: ['./finished-dialog.component.css'],
})
export class FinishedDialogComponent {
  private readonly data = inject<{
    meeting: Meeting;
    givenName: string;
    pdfFile: File;
  }>(DIALOG_DATA);

  private readonly pdfFile = this.data.pdfFile;

  readonly mail = buildReimbursementMail(
    this.data.meeting,
    this.data.givenName,
  );
  readonly emailHref = toMailtoHref(this.mail);

  /** Sharing with the PDF attached only works on browsers that support file sharing. */
  readonly canShare =
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [this.pdfFile] });

  readonly copied = signal<CopyField | null>(null);

  async share(): Promise<void> {
    try {
      await navigator.share({
        files: [this.pdfFile],
        title: this.mail.subject,
        text: this.mail.body,
      });
    } catch (error) {
      // The user dismissing the share sheet is not an error.
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('Error sharing PDF:', error);
      }
    }
  }

  async copy(field: CopyField): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.mail[field]);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return;
    }
    this.copied.set(field);
    setTimeout(() => {
      if (this.copied() === field) {
        this.copied.set(null);
      }
    }, 2000);
  }
}
