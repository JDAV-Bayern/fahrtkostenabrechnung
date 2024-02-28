import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { PlzService } from 'src/app/plz.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent {
  participantForm: FormGroup;
  courseForm: FormGroup;

  constructor(
    private readonly router: Router,
    public readonly plzService: PlzService,
    controlService: ReimbursementControlService
  ) {
    this.participantForm = controlService.participantStep;
    this.courseForm = controlService.courseStep;
  }

  get name() {
    return this.participantForm.get('name') as FormControl<string>;
  }

  get street() {
    return this.participantForm.get('street') as FormControl<string>;
  }

  get zipCode() {
    return this.participantForm.get('zipCode') as FormControl<string>;
  }

  get city() {
    return this.participantForm.get('city') as FormControl<string>;
  }

  get courseCode() {
    return this.courseForm.get('code') as FormControl<string>;
  }

  get courseName() {
    return this.courseForm.get('name') as FormControl<string>;
  }

  get courseDate() {
    return this.courseForm.get('date') as FormControl<string>;
  }

  get courseLocation() {
    return this.courseForm.get('location') as FormControl<string>;
  }

  plzChanged() {
    const plz = this.participantForm.value.zipCode;
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const city = results[0].city;
      if (!city.includes(',')) {
        this.participantForm.patchValue({ city });
      }
    }
  }

  next() {
    if (this.participantForm.valid && this.courseForm.valid) {
      this.router.navigate(['auslagen']);
    }
  }
}
