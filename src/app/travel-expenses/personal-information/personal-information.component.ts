import { Component } from '@angular/core';
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
  participantForm;
  courseForm;

  sections: Section[] = [];

  constructor(
    private readonly router: Router,
    private readonly plzService: PlzService,
    private readonly sectionService: SectionService,
    public controlService: ReimbursementControlService
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
    return this.participantForm.controls.givenName;
  }

  get familyName() {
    return this.participantForm.controls.familyName;
  }

  get sectionId() {
    return this.participantForm.controls.sectionId;
  }

  get zipCode() {
    return this.participantForm.controls.zipCode;
  }

  get city() {
    return this.participantForm.controls.city;
  }

  get courseCode() {
    return this.courseForm.controls.code;
  }

  get courseName() {
    return this.courseForm.controls.name;
  }

  groupByFn(item: Section) {
    return 'JDAV ' + item.jdavState.name;
  }

  plzChanged() {
    const plz = this.zipCode.value;
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
