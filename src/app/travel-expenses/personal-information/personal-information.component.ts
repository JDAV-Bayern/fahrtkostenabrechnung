import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';
import { PlzService } from 'src/app/plz.service';
import { Section } from 'src/domain/section';
import { SectionService } from 'src/app/section.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent {
  participantForm: FormGroup;
  courseForm: FormGroup;

  sections: Section[] = [];

  constructor(
    private readonly router: Router,
    private readonly plzService: PlzService,
    private readonly sectionService: SectionService,
    private readonly controlService: ReimbursementControlService
  ) {
    this.participantForm = controlService.participantStep;
    this.courseForm = controlService.courseStep;

    // load section autocompletions
    this.sections = this.sectionService.getSections();
    this.sections.sort((a, b) => {
      const isBavarianA = this.sectionService.isBavarian(a);
      const isBavarianB = this.sectionService.isBavarian(b);
      /*
       * Sort by multipe criteria with descending priority:
       * 1. Sort Bavarian sections first
       * 2. Sort other states alphabetically
       * 3. Sort sections within the same state alphabetically
       */
      return (
        Number(isBavarianB) - Number(isBavarianA) ||
        a.jdavState.name.localeCompare(b.jdavState.name) ||
        a.name.localeCompare(b.name)
      );
    });
  }

  get givenName() {
    return this.participantForm.get('givenName') as FormControl<string>;
  }

  get surname() {
    return this.participantForm.get('surname') as FormControl<string>;
  }

  get sectionId() {
    return this.participantForm.get('sectionId') as FormControl<number>;
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

  groupByFn(item: Section) {
    return 'JDAV ' + item.jdavState.name;
  }

  sectionChanged() {
    // ng-select change event is not detected by the form
    this.controlService.saveForm();
  }

  plzChanged() {
    const plz = this.participantForm.value.zipCode;
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const city = results[0].city;
      this.participantForm.patchValue({ city });
    }
  }

  next() {
    if (this.participantForm.valid && this.courseForm.valid) {
      this.router.navigate(['auslagen']);
    }
  }
}
