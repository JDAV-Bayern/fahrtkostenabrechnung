import { Dialog } from '@angular/cdk/dialog';
import { formatDate } from '@angular/common';
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
} from '@angular/core';
import { PdfViewComponent } from '../reimbursement/pdf-view/pdf-view.component';
import { ReimbursementFormService } from '../reimbursement/shared/reimbursement-form.service';
import { FinishedDialogComponent } from '../reimbursement/steps/overview-step/finished-dialog/finished-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly formService = inject(ReimbursementFormService);
  private readonly dialog = inject(Dialog);
  private readonly appRef = inject(ApplicationRef);

  private get reimbursement() {
    return this.formService.reimbursement();
  }

  async renderPdf() {
    // create container
    const container = document.createElement('div');
    container.id = 'jdav-pdf-container';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // create component
    const compRef = createComponent(PdfViewComponent, {
      environmentInjector: this.appRef.injector,
    });
    container.appendChild(compRef.location.nativeElement);
    this.appRef.attachView(compRef.hostView);
    compRef.setInput('reimbursement', this.reimbursement);

    await new Promise<void>((resolve) => {
      compRef.instance.fullyRendered.subscribe(async () => {
        await this.processPdf();
        compRef.destroy();
        container.remove();
        resolve();
      });
    });
  }

  private async processPdf(): Promise<void> {
    const files = this.formService.files();
    const htmlElement = document.getElementById('jdav-pdf-content');

    if (!htmlElement) {
      return;
    }

    const subject = JSON.stringify(this.reimbursement);

    let pdfFile: File;
    try {
      const { createPdf, combinePdf } = await import('./pdf-creation');
      const pdfData = await createPdf(htmlElement);
      const blob = await combinePdf(pdfData, files, subject);
      pdfFile = new File([blob], this.fileName(), { type: blob.type });
      this.downloadPdf(pdfFile);
    } catch (error) {
      console.error('Error generating PDF:', error);
      return;
    }

    this.dialog.open(FinishedDialogComponent, {
      data: {
        givenName: this.reimbursement.participant.givenName,
        meeting: this.reimbursement.meeting,
        pdfFile,
      },
    });
  }

  private fileName(): string {
    const meeting = this.reimbursement.meeting;
    const lastName = this.reimbursement.participant.familyName;

    if (meeting.type === 'course') {
      return `Fahrtkostenabrechnung_${meeting.code}_${lastName}.pdf`;
    }
    const timestamp = formatDate(meeting.time.start, 'yyyyMMdd', 'de-DE');
    return `Fahrtkostenabrechnung_${lastName}_${timestamp}.pdf`;
  }

  downloadPdf(file: File) {
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = file.name;
    link.click();
  }
}
