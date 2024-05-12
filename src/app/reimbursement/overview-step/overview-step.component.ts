import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import * as imageprocessor from 'ts-image-processor';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PDFDocument } from 'pdf-lib';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursemen-validator.service';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { FinishedDialogComponent } from './finished-dialog/finished-dialog.component';
import { CurrencyPipe, KeyValuePipe, formatDate } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ProgressIndicatorComponent } from 'src/app/shared/icons/progress-indicator/progress-indicator.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReimbursementService } from '../shared/reimbursement.service';
import { ExpenseTypePipe } from '../../expenses/shared/expense-type.pipe';

@Component({
  selector: 'app-overview-step',
  templateUrl: './overview-step.component.html',
  styleUrls: ['./overview-step.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
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
  form;

  files: File[] = [];
  showPdf = false;
  loading = false;

  readonly originalOrder = () => 0;

  pdfFullyRendered = () => {
    console.error('pdfFullyRendered not set');
  };
  pdfFullyRenderedPromise: Promise<void> = new Promise(resolve => {
    this.pdfFullyRendered = resolve;
  });

  constructor(
    private readonly reimbursementService: ReimbursementService,
    private readonly controlService: ReimbursementControlService,
    private readonly validationService: ReimbursementValidatorService,
    private readonly dialog: Dialog
  ) {
    this.form = controlService.overviewStep;
  }

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

  async addImageToPdf(imageFile: File, pdf: jsPDF) {
    const maxWidth = 575;
    const maxHeight = 802;

    const image = await imageprocessor.fileToBase64(imageFile);
    const exifRotated = await imageprocessor.imageProcessor
      .src(image)
      .pipe(imageprocessor.applyExifOrientation());

    const preprocessedImage =
      await imageprocessor.base64ToImgElement(exifRotated);

    let originalHeight = preprocessedImage.height;
    let originalWidth = preprocessedImage.width;

    let finalImageData: string;
    if (originalWidth > originalHeight) {
      //The image is in landscape, lets rotate it to view it larger
      finalImageData = await imageprocessor.imageProcessor
        .src(exifRotated)
        .pipe(
          imageprocessor.rotate({ degree: 90, clockwise: false }),
          imageprocessor.resize({ maxWidth: 1240, maxHeight: 1713 }),
          imageprocessor.sharpen()
        );
      //Swap originalHeight and originalWidth because we rotated by 90 degrees
      const x = originalHeight;
      originalHeight = originalWidth;
      originalWidth = x;
    } else {
      //only resize to 150dpi
      finalImageData = await imageprocessor.imageProcessor
        .src(exifRotated)
        .pipe(
          imageprocessor.resize({ maxWidth: 1240, maxHeight: 1713 }),
          imageprocessor.sharpen()
        );
    }

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      const aspectRatio = originalWidth / originalHeight;

      if (originalWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
    }

    pdf.addPage();
    pdf.addImage(
      finalImageData,
      10,
      10,
      newWidth,
      newHeight,
      undefined,
      'FAST'
    );
  }

  async addPdfToPdf(pdfFile: File, pdf: PDFDocument) {
    const fileExtension = pdfFile.name.split('.').pop();
    if (fileExtension !== 'pdf') {
      return;
    }
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDocument = await PDFDocument.load(arrayBuffer);
    (await pdf.copyPages(pdfDocument, pdfDocument.getPageIndices())).forEach(
      page => {
        pdf.addPage(page);
      }
    );
  }

  async onSubmit() {
    this.loading = true;
    this.showPdf = true;
    await new Promise(resolve => setTimeout(resolve, 0));
    await this.pdfFullyRenderedPromise;

    const htmlElement = document.getElementById('pdf-container');
    if (!htmlElement || !this.form.valid) {
      this.loading = false;
      this.showPdf = false;
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

    this.showPdf = false;

    // go through files and add image attachments
    for (const file of this.files) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension && fileExtension !== 'pdf') {
        await this.addImageToPdf(file, doc);
      }
    }

    const arrayBuffer = doc.output('arraybuffer');
    const startPdfDocument = await PDFDocument.load(arrayBuffer);

    const combinedPdfDocument = await PDFDocument.create();
    (
      await combinedPdfDocument.copyPages(
        startPdfDocument,
        startPdfDocument.getPageIndices()
      )
    ).forEach(page => {
      combinedPdfDocument.addPage(page);
    });

    // go through files and add pdf attachments
    for (const file of this.files) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension && fileExtension === 'pdf') {
        await this.addPdfToPdf(file, combinedPdfDocument);
      }
    }

    combinedPdfDocument.setSubject(JSON.stringify(this.reimbursement));

    const pdfBytes = await combinedPdfDocument.save();
    const file = new Blob([pdfBytes], { type: 'application/ pdf' });
    const fileURL = URL.createObjectURL(file);

    let fileName;
    const meeting = this.reimbursement.meeting;
    const lastName = this.reimbursement.participant.familyName;

    switch (meeting.type) {
      case 'course':
        fileName = `Fahrtkostenabrechnung_${meeting.code}_${lastName}.pdf`;
        break;
      case 'assembly':
        fileName = `Fahrtkostenabrechnung_LJV_${lastName}.pdf`;
        break;
      case 'committee':
        const timestamp = formatDate(meeting.time.start, 'yyyyMMdd', 'de-DE');
        fileName = `Fahrtkostenabrechnung_${lastName}_${timestamp}.pdf`;
        break;
    }

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    link.click();
    link.remove();
    this.loading = false;

    this.dialog.open(FinishedDialogComponent, {
      data: {
        givenName: this.reimbursement.participant.givenName,
        meeting: this.reimbursement.meeting
      }
    });
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
