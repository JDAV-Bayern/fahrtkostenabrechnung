import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

import { validateIBAN } from "ngx-iban-validator";
import { IReimbursement } from 'src/domain/reimbursement';
import { ReimbursementService } from '../reimbursement.service';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { PDFDocument } from 'pdf-lib';


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
    const fileExtension = imageFile.name.split('.').pop();
    const allDone = new Promise<void>(resolve => {
      const imageFileReader = new FileReader();
      imageFileReader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          // Access the image width and height
          const originalWidth = img.width;
          const originalHeight = img.height;

          // Set maximum dimensions
          const maxWidth = 575;
          const maxHeight = 802;

          // Calculate new dimensions while maintaining the aspect ratio
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


          // Do something with the width and height
          console.log('Image Width:', newWidth);
          console.log('Image Height:', newHeight);
          pdf.addPage();
          pdf.addImage(img, fileExtension === 'png' ? 'PNG' : 'JPEG', 10, 10, newWidth, newHeight, undefined, 'FAST');
          resolve()
        };
      };
      imageFileReader.readAsDataURL(imageFile);
    });
    await allDone;
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
    const htmlElement = document.getElementById("pdf-container");
    if (!htmlElement) {
      return;
    }
    const doc = new jsPDF('p', 'pt', [595, 822], true);
    //add the first page
    await new Promise<void>(resolve => doc.html(htmlElement, {
      autoPaging: "text"
    }).finally(() => resolve()));


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
    link.download = 'fahrtkostenabrechnung.pdf';
    link.click();
    link.remove();
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

  getDate() {
    //Get date in the format DD.MM.YYYY
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  r(): IReimbursement {
    if (!this.reimbursement) {
      this.reimbursement = this.reimbursementService.getReimbursment();
    }
    return this.reimbursement;
  }

}
