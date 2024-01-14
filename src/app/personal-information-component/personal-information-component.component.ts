import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from '../reimbursement.service';

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
    private readonly reimbursementService: ReimbursementService) {
    // Initialize the form with FormBuilder
    const reimbursement = this.reimbursementService.getReimbursment()
    this.personalInfoForm = this.formBuilder.group({
      name: [reimbursement.participantDetails.name, Validators.required],
      street: [reimbursement.participantDetails.street, Validators.required],
      city: [reimbursement.participantDetails.city, Validators.required],
      course: [reimbursement.courseDetails.id, Validators.required],
      courseName: [reimbursement.courseDetails.courseName, Validators.required],
      courseDate: [reimbursement.courseDetails.courseDate, Validators.required],
      courseLocation: [reimbursement.courseDetails.courseLocation, Validators.required],
    });
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
      )
      this.router.navigate(['auslagen']);
    }
  }
}
