import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CurrencyPipe, KeyValuePipe, formatDate } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import jsPDF from 'jspdf';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursement-validator.service';
import { FinishedDialogComponent } from './finished-dialog/finished-dialog.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { createPdf } from 'src/app/shared/pdf-creation';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { ExpenseTypePipe } from '../../expenses/shared/expense-type.pipe';
import { ReimbursementService } from '../shared/reimbursement.service';
import { PdfViewComponent } from './pdf-view/pdf-view.component';

@Component({
  selector: 'app-overview-step',
  templateUrl: './overview-step.component.html',
  styleUrls: ['./overview-step.component.css'],
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    KeyValuePipe,
    DialogModule,
    NgxFileDropModule,
    FormCardComponent,
    ProgressIndicatorComponent,
    PdfViewComponent,
    ExpenseTypePipe
  ]
})
export class OverviewStepComponent {
  private readonly reimbursementService = inject(ReimbursementService);
  private readonly controlService = inject(ReimbursementControlService);
  private readonly validationService = inject(ReimbursementValidatorService);
  private readonly dialog = inject(Dialog);

  form = this.controlService.overviewStep;

  files: File[] = [];
  readonly showPdf = signal(false);
  readonly loading = signal(false);

  readonly originalOrder = () => 0;

  pdfFullyRendered = () => {
    console.error('pdfFullyRendered not set');
  };
  pdfFullyRenderedPromise = new Promise<void>(resolve => {
    this.pdfFullyRendered = resolve;
  });

  get reimbursement() {
    return this.controlService.getReimbursement();
  }

  get meeting() {
    return this.reimbursement.meeting;
  }

  get participant() {
    return this.reimbursement.participant;
  }

  get prevStep() {
    const meeting = this.controlService.meetingStep.controls.type.value;
    return meeting === 'committee' ? 'auslagen-gremium' : 'auslagen';
  }

  get report() {
    return this.reimbursementService.getReport(this.reimbursement);
  }

  getWarnings(): string[] {
    return this.validationService.validateReimbursement(this.reimbursement);
  }

  async onSubmit() {
    this.loading.set(true);
    this.showPdf.set(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    await this.pdfFullyRenderedPromise;

    const htmlElement = document.getElementById('pdf-container');
    if (!htmlElement || !this.form.valid) {
      this.loading.set(false);
      this.showPdf.set(false);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 0));
    const doc = new jsPDF('p', 'pt', [595, 822], true);
    //Add mailto link and logo
    doc.link(170, 57, 70, 10, {
      url: 'mailto:lgs@jdav-bayern.de'
    });

    //add the first page
    await new Promise<void>(resolve =>
      doc
        .html(htmlElement, {
          autoPaging: true
        })
        .finally(() => resolve())
    );

    this.showPdf.set(false);

    const subject = JSON.stringify(this.reimbursement);

    try {
      const blob = await createPdf(doc, this.files, subject);
      this.downloadPdf(blob);
    } finally {
      this.loading.set(false);
    }

    this.dialog.open(FinishedDialogComponent, {
      data: {
        givenName: this.reimbursement.participant.givenName,
        meeting: this.reimbursement.meeting
      }
    });
  }

  downloadPdf(blob: Blob) {
    let fileName;
    const meeting = this.reimbursement.meeting;
    const lastName = this.reimbursement.participant.familyName;

    switch (meeting.type) {
      case 'course': {
        fileName = `Fahrtkostenabrechnung_${meeting.code}_${lastName}.pdf`;
        break;
      }
      case 'assembly': {
        fileName = `Fahrtkostenabrechnung_LJV_${lastName}.pdf`;
        break;
      }
      case 'committee': {
        const timestamp = formatDate(meeting.time.start, 'yyyyMMdd', 'de-DE');
        fileName = `Fahrtkostenabrechnung_${lastName}_${timestamp}.pdf`;
        break;
      }
    }

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    link.click();
  }

  fileDropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files.push(file);
        });
      }
    }
  }

  removeFile(fileName: string) {
    this.files = this.files.filter(f => f.name !== fileName);
  }
}
