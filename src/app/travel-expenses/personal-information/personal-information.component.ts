import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from 'src/app/reimbursement.service';
import { PlzService } from 'src/app/plz.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent {
  personalInfoForm: FormGroup;

  constructor(
    private readonly router: Router,
    public readonly plzService: PlzService,
    reimbursementService: ReimbursementService
  ) {
    this.personalInfoForm = reimbursementService.getFormStep(
      'personalInformation'
    );
  }

  get name() {
    return this.personalInfoForm.get('name') as FormControl<string>;
  }

  get street() {
    return this.personalInfoForm.get('street') as FormControl<string>;
  }

  get zipCode() {
    return this.personalInfoForm.get('zipCode') as FormControl<string>;
  }

  get city() {
    return this.personalInfoForm.get('city') as FormControl<string>;
  }

  get courseCode() {
    return this.personalInfoForm.get('course.code') as FormControl<string>;
  }

  get courseName() {
    return this.personalInfoForm.get('course.name') as FormControl<string>;
  }

  get courseDate() {
    return this.personalInfoForm.get('course.date') as FormControl<string>;
  }

  get courseLocation() {
    return this.personalInfoForm.get('course.location') as FormControl<string>;
  }

  plzChanged() {
    const plz = this.personalInfoForm.value.zipCode;
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const city = results[0].city;
      if (!city.includes(',')) {
        this.personalInfoForm.patchValue({ city });
      }
    }
  }

  next() {
    if (this.personalInfoForm.valid) {
      this.router.navigate(['auslagen']);
    }
  }
}
