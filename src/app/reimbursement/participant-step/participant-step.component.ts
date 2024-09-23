import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { LocalityService } from 'src/app/core/locality.service';
import { SectionService } from 'src/app/core/section.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Federation, FederationLevel, Section } from 'src/domain/section.model';
import { forkJoin, map, switchMap } from 'rxjs';

interface ResolvedFederation extends Federation {
  sections: Section[];
}

@Component({
  selector: 'app-participant-step',
  templateUrl: './participant-step.component.html',
  styleUrls: ['./participant-step.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormCardComponent
  ]
})
export class ParticipantStepComponent {
  @ViewChild('sectionInput')
  sectionInput?: ElementRef<HTMLInputElement>;

  form;
  states: ResolvedFederation[] = [];
  filteredStates?: ResolvedFederation[];

  constructor(
    private readonly localityService: LocalityService,
    private readonly sectionService: SectionService,
    public controlService: ReimbursementControlService
  ) {
    this.form = controlService.participantStep;

    // autcomplete locality
    this.zipCode.valueChanges
      .pipe(switchMap(value => this.localityService.search(value)))
      .subscribe(results => {
        if (results.length === 1) {
          const city = results[0].name;
          this.form.patchValue({ city });
        }
      });

    // load section autocompletions
    this.sectionService
      .getFederations()
      .pipe(
        map(federations =>
          federations.filter(
            federation => federation.type === FederationLevel.STATE
          )
        ),
        map(states =>
          states.sort((a, b) => {
            // TODO make this database driven
            const isBavarianA = a.name === 'Bayern';
            const isBavarianB = a.name === 'Bayern';
            return isBavarianA ? -1 : isBavarianB ? 1 : 0;
          })
        ),
        switchMap(states =>
          forkJoin(
            // load sections for each state
            states.map(state =>
              state.sections$.pipe(
                map(sections => ({ ...state, sections: sections }))
              )
            )
          )
        )
      )
      .subscribe(states => {
        this.states = states;
        this.filter();
      });
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
      case 'committee':
        return 'gremium';
      default:
        return 'kurs';
    }
  }

  filter() {
    if (!this.sectionInput) {
      this.filteredStates = this.states;
      return;
    }

    const filterValue = this.sectionInput.nativeElement.value.toLowerCase();
    this.filteredStates = this.states
      .map(state => ({
        ...state,
        sections: state.sections.filter(section =>
          section.name.toLowerCase().includes(filterValue)
        )
      }))
      .filter(state => state.sections.length > 0);
  }

  displayFn = (value: number) =>
    this.states
      .flatMap(state => state.sections)
      .find(section => section.id === value)?.name || '';
}
