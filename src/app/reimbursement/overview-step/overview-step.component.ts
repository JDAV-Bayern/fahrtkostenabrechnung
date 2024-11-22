import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  AsyncPipe,
  CurrencyPipe,
  formatDate,
  KeyValuePipe
} from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { PDFDocument } from 'pdf-lib';
import { combineLatest, first, map, of, switchMap } from 'rxjs';
import { CourseService } from 'src/app/core/course.service';
import { SectionService } from 'src/app/core/section.service';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { ReimbursementValidatorService } from 'src/app/reimbursement/shared/reimbursement-validator.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ProgressIndicatorComponent } from 'src/app/shared/progress-indicator/progress-indicator.component';
import { Meeting } from 'src/domain/meeting.model';
import { Reimbursement } from 'src/domain/reimbursement.model';
import { Federation, Section } from 'src/domain/section.model';
import * as imageprocessor from 'ts-image-processor';
import { ExpenseTypePipe } from '../../expenses/shared/expense-type.pipe';
import {
  ReimbursementReport,
  ReimbursementService
} from '../shared/reimbursement.service';
import { FinishedDialogComponent } from './finished-dialog/finished-dialog.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';

export interface PdfContext {
  reimbursement: Reimbursement;
  report: ReimbursementReport;
  meeting: Meeting;
  section: Section & { state: Federation };
}

@Component({
  selector: 'app-overview-step',
  templateUrl: './overview-step.component.html',
  styleUrls: ['./overview-step.component.css'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
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
  private readonly sectionService = inject(SectionService);
  private readonly courseService = inject(CourseService);
  private readonly controlService = inject(ReimbursementControlService);
  private readonly validationService = inject(ReimbursementValidatorService);
  private readonly dialog = inject(Dialog);

  form = this.controlService.overviewStep;

  files: File[] = [];

  loading = false;
  showPdf = false;
  pdfContext?: PdfContext;

  reimbursement$ = this.controlService.reimbursement$;
  report$ = this.controlService.reimbursement$.pipe(
    switchMap(reimbursement =>
      this.reimbursementService.getReport(reimbursement)
    )
  );
  warnings$ = this.controlService.reimbursement$.pipe(
    switchMap(reimbursement =>
      this.validationService.validateReimbursement(reimbursement)
    )
  );

  meeting$ = this.reimbursement$.pipe(
    switchMap(reimbursement => {
      switch (reimbursement.type) {
        case 'course':
          return this.courseService.getCourse(reimbursement.course);
        case 'committee':
          return of(reimbursement.committee);
      }
    })
  );

  name$ = this.meeting$.pipe(
    map(meeting =>
      'number' in meeting && meeting.number
        ? `${meeting.number} \u2013 ${meeting.name}`
        : meeting.name
    )
  );

  readonly originalOrder = () => 0;

  get participant$() {
    return this.reimbursement$.pipe(
      map(reimbursement => reimbursement.participant)
    );
  }

  get prevStep() {
    const meeting = this.controlService.meetingStep.controls.type.value;
    return meeting === 'committee' ? 'auslagen-gremium' : 'auslagen';
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

  onSubmit() {
    this.loading = true;

    this.reimbursement$
      .pipe(first())
      .subscribe(reimbursement =>
        this.reimbursementService.save(reimbursement)
      );

    const section$ = this.participant$.pipe(
      switchMap(participant =>
        this.sectionService.getSection(participant.sectionId)
      ),
      switchMap(section =>
        section.state$.pipe(map(state => ({ ...section, state })))
      )
    );

    combineLatest({
      reimbursement: this.reimbursement$,
      report: this.report$,
      meeting: this.meeting$,
      section: section$
    })
      .pipe(first())
      .subscribe(pdfContext => {
        this.showPdf = true;
        this.pdfContext = pdfContext;
      });
  }

  async createPDF() {
    const htmlElement = document.getElementById('pdf-container');

    if (!htmlElement || !this.pdfContext || !this.form.valid) {
      console.error('Could not find PDF container or form is invalid');
      this.loading = false;
      this.showPdf = false;
      return;
    }

    const { reimbursement, meeting } = this.pdfContext;

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

    combinedPdfDocument.setSubject(JSON.stringify(reimbursement));

    const pdfBytes = await combinedPdfDocument.save();
    const file = new Blob([pdfBytes], { type: 'application/ pdf' });
    const fileURL = URL.createObjectURL(file);

    let fileName;
    const subject = 'number' in meeting ? meeting.number : meeting.name;
    const lastName = reimbursement.participant.familyName;

    switch (reimbursement.type) {
      case 'course': {
        fileName = `Fahrtkostenabrechnung_${subject}_${lastName}.pdf`;
        break;
      }
      case 'committee': {
        const timestamp = formatDate(meeting.startDate, 'yyyyMMdd', 'de-DE');
        fileName = `Fahrtkostenabrechnung_${lastName}_${timestamp}.pdf`;
        break;
      }
    }

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    link.click();
    link.remove();
    this.loading = false;

    this.dialog.open(FinishedDialogComponent, {
      data: {
        givenName: reimbursement.participant.givenName,
        subject
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
