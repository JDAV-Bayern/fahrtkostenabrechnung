import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from '../reimbursement.service';
import { MatDialog } from '@angular/material/dialog';
import { DataProtectionDialogComponent } from './data-protection-dialog/data-protection-dialog.component';
import { PlzService } from '../plz.service';

@Component({
  selector: 'app-personal-information-component',
  templateUrl: './personal-information-component.component.html',
  styleUrls: ['./personal-information-component.component.css']
})
export class PersonalInformationComponentComponent {
  personalInfoForm: FormGroup;

  navigateToStep(step: string) {
    console.log(`navigating to step ${step}`)
  }

  constructor(private formBuilder: FormBuilder,
    private readonly router: Router,
    public dialog: MatDialog,
    public readonly plzService: PlzService,
    private readonly reimbursementService: ReimbursementService) {
    // Initialize the form with FormBuilder
    const reimbursement = this.reimbursementService.getReimbursment()
    this.personalInfoForm = this.formBuilder.group({
      name: [reimbursement.participantDetails.name, Validators.required],
      street: [reimbursement.participantDetails.street, Validators.required],
      city: [reimbursement.participantDetails.city, Validators.required],
      zipCode: [reimbursement.participantDetails.zipCode, [Validators.required, Validators.pattern(/^[0-9][0-9][0-9][0-9][0-9]$/)]],
      course: [reimbursement.courseDetails.id, Validators.required],
      courseName: [reimbursement.courseDetails.courseName, Validators.required],
      courseDate: [reimbursement.courseDetails.courseDate, Validators.required],
      courseLocation: [reimbursement.courseDetails.courseLocation, Validators.required],
    });
  }

  plzChanged() {
    console.log("plz changed");
    const plz = this.personalInfoForm.value.zipCode;
    console.log(plz)
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const isBavaria = results[0].isBavaria;
      const city = results[0].city;
      if (!city.includes(',')) {
        this.personalInfoForm.patchValue({ city });
      }
    }
  }

  // Define the onSubmit method to handle form submission
  onSubmit() {
    if (this.personalInfoForm.valid) {
      this.reimbursementService.setPersonalAndCourseInformation(
        this.personalInfoForm.value.name,
        this.personalInfoForm.value.street,
        this.personalInfoForm.value.city,
        this.personalInfoForm.value.course,
        this.personalInfoForm.value.courseName,
        this.personalInfoForm.value.courseDate,
        this.personalInfoForm.value.courseLocation,
        this.personalInfoForm.value.zipCode,
        this.plzService.search(this.personalInfoForm.value.zipCode)[0].isBavaria,
      )
      this.router.navigate(['auslagen']);
    }
  }

  openDataProtectionInfoDialog() {
    const dialogRef = this.dialog.open(DataProtectionDialogComponent, {
      id: 'add-expense-modal',
      width: 'min(95vw, 500px)',
    });
  }
}
