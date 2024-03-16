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
  form;
  sections: Section[] = [];

  constructor(
    private readonly router: Router,
    private readonly plzService: PlzService,
    private readonly sectionService: SectionService,
    public controlService: ReimbursementControlService
  ) {
    this.form = controlService.participantStep;

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

  ngOnInit() {
    if (!this.controlService.courseStep.valid) {
      this.router.navigate(['kurs']);
    }
  }

  get givenName() {
    return this.form.controls.givenName;
  }

  get familyName() {
    return this.form.controls.familyName;
  }

  get sectionId() {
    return this.form.controls.sectionId;
  }

  get zipCode() {
    return this.form.controls.zipCode;
  }

  get city() {
    return this.form.controls.city;
  }

  get iban() {
    return this.form.controls.iban;
  }

  get bic() {
    return this.form.controls.bic;
  }

  groupByFn(item: Section) {
    return 'JDAV ' + item.jdavState.name;
  }

  plzChanged() {
    const plz = this.zipCode.value;
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const city = results[0].city;
      this.form.patchValue({ city });
    }
  }
}
