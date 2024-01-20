import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as imageprocessor from 'ts-image-processor';
import { validateIBAN } from "ngx-iban-validator";
import { IReimbursement } from 'src/domain/reimbursement';
import { ReimbursementService } from '../reimbursement.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { PDFDocument } from 'pdf-lib';
import { logoBase64 } from 'src/assets/logoBase64';



@Component({
  selector: 'app-submission-overview-component',
  templateUrl: './submission-overview-component.component.html',
  styleUrls: ['./submission-overview-component.component.css']
})
export class SubmissionOverviewComponentComponent {

  formGroup: FormGroup
  fileFormGroup: FormGroup;

  reimbursement: IReimbursement | undefined

  public files: File[] = [];

  showPdf = false;

  loading = false;


  pdfFullyRendered = () => { console.error("pdfFullyRendered not set") };
  pdfFullyRenderedPromise: Promise<void> = new Promise(resolve => {
    this.pdfFullyRendered = resolve;
  });


  constructor(private readonly router: Router, private formBuilder: FormBuilder, private readonly reimbursementService: ReimbursementService) {
    this.formGroup = this.formBuilder.group({
      inputIBAN: ['', [Validators.required, validateIBAN]],
      inputBIC: ['', []],
    })
    this.fileFormGroup = this.formBuilder.group({
      file: [undefined, []]
    });
  }

  ngOnInit(): void {
    this.formGroup.setValue({
      inputIBAN: this.r()?.participantDetails?.iban || '',
      inputBIC: this.r()?.participantDetails?.bic || '',
    });
  }

  saveForm() {
    console.log("saving form...")
    if (this.formGroup.valid) {
      console.log("form is valid")
      const iban = this.formGroup.get('inputIBAN')?.value;
      const bic = this.formGroup.get('inputBIC')?.value;
      if (this.reimbursement) {
        this.reimbursement.participantDetails.iban = iban;
        this.reimbursement.participantDetails.bic = bic;
      }
      this.reimbursementService.setSubmitInformation(iban, bic);
    }
  }

  async addImageToPdf(imageFile: File, pdf: jsPDF) {
    const maxWidth = 575;
    const maxHeight = 802;

    const image = await imageprocessor.fileToBase64(imageFile);
    const exifRotated = await imageprocessor.imageProcessor.src(image).pipe(
      imageprocessor.applyExifOrientation(),
    )

    const preprocessedImage = await imageprocessor.base64ToImgElement(exifRotated)

    let originalHeight = preprocessedImage.height;
    let originalWidth = preprocessedImage.width;

    let finalImageData: string;
    if (originalWidth > originalHeight) {
      //The image is in landscape, lets rotate it to view it larger
      finalImageData = await imageprocessor.imageProcessor.src(exifRotated).pipe(
        imageprocessor.rotate({ degree: 90, clockwise: false }),
        imageprocessor.resize({ maxWidth: 1240, maxHeight: 1713 }),
        imageprocessor.sharpen()
      )
      //Swap originalHeight and originalWidth because we rotated by 90 degrees
      const x = originalHeight;
      originalHeight = originalWidth;
      originalWidth = x;
    } else {
      //only resize to 150dpi
      finalImageData = await imageprocessor.imageProcessor.src(exifRotated).pipe(
        imageprocessor.resize({ maxWidth: 1240, maxHeight: 1713 }),
        imageprocessor.sharpen()
      )
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
    pdf.addImage(finalImageData, 10, 10, newWidth, newHeight, undefined, 'FAST');
  }

  async addPdfToPdf(pdfFile: File, pdf: PDFDocument) {
    const fileExtension = pdfFile.name.split('.').pop();
    if (fileExtension !== 'pdf') {
      return;
    }
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDocument = await PDFDocument.load(arrayBuffer);
    (await pdf.copyPages(pdfDocument, pdfDocument.getPageIndices())).forEach(page => {
      pdf.addPage(page);
    });
  }

  async continue() {
    console.log("generating pdf...");
    this.loading = true;
    this.showPdf = true;
    await new Promise(resolve => setTimeout(resolve, 0));
    await this.pdfFullyRenderedPromise;

    const htmlElement = document.getElementById("pdf-container")
    if (!htmlElement || !this.formGroup.valid) {
      this.loading = false;
      this.showPdf = false;
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 0));
    const doc = new jsPDF('p', 'pt', [595, 822], true);
    //add the first page
    await new Promise<void>(resolve => doc.html(htmlElement, {
      autoPaging: "text"
    }).finally(() => resolve()));

    this.showPdf = false;

    //Add mailto link and logo
    doc.link(170, 57, 70, 10, {
      url: 'mailto:lgs@jdav-bayern.de'
    });
    doc.addImage(logoBase64, 'JPEG', 374, 57, 164, 85);

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
    (await combinedPdfDocument.copyPages(startPdfDocument, startPdfDocument.getPageIndices())).forEach(page => {
      combinedPdfDocument.addPage(page);
    });

    // go through files and add pdf attachments
    for (const file of this.files) {
      const fileExtension = file.name.split('.').pop();
      if (fileExtension && fileExtension === 'pdf') {
        await this.addPdfToPdf(file, combinedPdfDocument);
      }
    }

    const pdfBytes = await combinedPdfDocument.save();
    const file = new Blob([pdfBytes], { type: 'application/ pdf' });
    const fileURL = URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `fka_${this.reimbursement?.courseDetails.id}_${this.reimbursement?.participantDetails.name.split(' ').pop()?.trim()}.pdf`;
    link.click();
    link.remove();
    this.loading = false;
  }

  back() {
    this.router.navigate(['auslagen']);
  }

  submitForm() {
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

  r(): IReimbursement {
    if (!this.reimbursement) {
      this.reimbursement = this.reimbursementService.getReimbursment();
    }
    return this.reimbursement;
  }

}
