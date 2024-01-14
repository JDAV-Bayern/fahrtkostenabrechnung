import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

import { validateIBAN } from "ngx-iban-validator";
import { IReimbursement } from 'src/domain/reimbursement';
import { ReimbursementService } from '../reimbursement.service';


@Component({
  selector: 'app-submission-overview-component',
  templateUrl: './submission-overview-component.component.html',
  styleUrls: ['./submission-overview-component.component.css']
})
export class SubmissionOverviewComponentComponent {

  formGroup: FormGroup
  fileFormGroup: FormGroup;

  reimbursement: IReimbursement | undefined

  constructor(private readonly router: Router, private formBuilder: FormBuilder, private readonly reimbursementService: ReimbursementService) {
    this.formGroup = this.formBuilder.group({
      inputIBAN: ['', [Validators.required, validateIBAN]],
      inputBIC: ['', []],
    })
    this.fileFormGroup = this.formBuilder.group({
      file: [undefined, []]
    });
  }

  async continue() {
    console.log("generating pdf...");
    const htmlElement = document.getElementById("pdf-container");
    if (!htmlElement) {
      return;
    }
    const doc = new jsPDF('p', 'pt', [595, 822], true);
    await new Promise<void>(resolve => doc.html(htmlElement, {
      autoPaging: "text"
    }).finally(() => resolve()));
    doc.save("auslagen.pdf");
  }
  back() {
    this.router.navigate(['auslagen']);
  }
  submitForm() {
  }
  selectFile() {
    console.log(this.fileFormGroup);
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
