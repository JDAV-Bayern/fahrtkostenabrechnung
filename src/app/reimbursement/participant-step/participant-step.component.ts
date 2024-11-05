import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { PlzService } from 'src/app/core/plz.service';
import { SectionService } from 'src/app/core/section.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JdavState } from 'src/domain/section.model';

@Component({
  selector: 'app-participant-step',
  templateUrl: './participant-step.component.html',
  styleUrls: ['./participant-step.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormCardComponent
  ]
})
export class ParticipantStepComponent {
  @ViewChild('sectionInput')
  sectionInput!: ElementRef<HTMLInputElement>;

  form;
  states: JdavState[];
  filteredStates: JdavState[];

  constructor(
    private readonly plzService: PlzService,
    private readonly sectionService: SectionService,
    public controlService: ReimbursementControlService
  ) {
    this.form = controlService.participantStep;

    // load section autocompletions
    this.states = this.sectionService.getJdavStates();

    // Sort states alphabetically while keeping Bavaria at the top
    this.states.sort((a, b) => {
      const isBavarianA = a.id === 2;
      const isBavarianB = b.id === 2;

      return (
        Number(isBavarianB) - Number(isBavarianA) ||
        a.name.localeCompare(b.name)
      );
    });

    // Sort sections within the same state alphabetically
    this.states.forEach(state => {
      state.sections.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.filteredStates = this.states.slice();
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

  get prevStep() {
    switch (this.controlService.meetingStep.value.type) {
      case 'course':
        return 'kurs';
      case 'assembly':
        return 'ljv';
      case 'committee':
        return 'gremium';
      default:
        return 'kurs';
    }
  }

  filter() {
    const filterValue = this.sectionInput.nativeElement.value.toLowerCase();
    const filteredStates = this.states.map(state => ({
      id: state.id,
      name: state.name,
      sections: state.sections.filter(section =>
        section.name.toLowerCase().includes(filterValue)
      )
    }));
    this.filteredStates = filteredStates.filter(
      state => state.sections.length > 0
    );
  }

  displayFn() {
    return (item: number) => this.sectionService.getSection(item)?.name || '';
  }

  plzChanged() {
    const plz = this.zipCode.value;
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      const city = results[0].city;
      this.form.patchValue({ city });
    }
  }
  ibanChanged() {
    const iban = this.iban.value;
    const formatted =
      iban
        .toUpperCase()
        .replace(/\s/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') || '';
    this.form.patchValue({ iban: formatted });
  }
}
