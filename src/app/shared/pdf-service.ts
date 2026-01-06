import { Dialog } from '@angular/cdk/dialog';
import { formatDate } from '@angular/common';
import {
  ApplicationRef,
  createComponent,
  inject,
  Injectable,
} from '@angular/core';
import { PdfView } from '../reimbursement/pdf-view/pdf-view';
import { ReimbursementControlService } from '../reimbursement/shared/reimbursement-control.service';
import { FinishedDialog } from '../reimbursement/steps/overview-step/finished-dialog/finished-dialog';
import { combinePdf, createPdf } from './pdf-creation';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly dialog = inject(Dialog);
  private readonly appRef = inject(ApplicationRef);

  private get reimbursement() {
    return this.controlService.getReimbursement();
  }

  async renderPdf() {
    // create container
    const container = document.createElement('div');
    container.id = 'jdav-pdf-container';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // create component
    const compRef = createComponent(PdfView, {
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
    const files = this.controlService.overviewStep.controls.files.value;
    const htmlElement = document.getElementById('jdav-pdf-content');

    if (!htmlElement) {
      return;
    }

    const subject = JSON.stringify(this.reimbursement);

    try {
      const pdfData = await createPdf(htmlElement);
      const blob = await combinePdf(pdfData, files, subject);
      this.downloadPdf(blob);
    } catch (error) {
      console.error('Error generating PDF:', error);
      return;
    }

    this.dialog.open(FinishedDialog, {
      data: {
        givenName: this.reimbursement.participant.givenName,
        meeting: this.reimbursement.meeting,
      },
    });
  }

  downloadPdf(blob: Blob) {
    let fileName;
    const meeting = this.reimbursement.meeting;
    const lastName = this.reimbursement.participant.familyName;

    if (meeting.type === 'course') {
      fileName = `Fahrtkostenabrechnung_${meeting.code}_${lastName}.pdf`;
    } else {
      const timestamp = formatDate(meeting.time.start, 'yyyyMMdd', 'de-DE');
      fileName = `Fahrtkostenabrechnung_${lastName}_${timestamp}.pdf`;
    }

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    link.click();
  }
}
