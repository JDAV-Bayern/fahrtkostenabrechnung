import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterLink } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { SectionService } from 'src/app/core/section.service';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormAddressComponent } from 'src/app/shared/form-address/form-address.component';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { Federation, FederationLevel, Section } from 'src/domain/section.model';

interface ResolvedFederation extends Federation {
  sections: Section[];
}

@Component({
  selector: 'app-participant-step',
  templateUrl: './participant-step.component.html',
  styleUrls: ['./participant-step.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormCardComponent,
    FormAddressComponent
  ]
})
export class ParticipantStepComponent implements OnInit {
  private readonly sectionService = inject(SectionService);
  private readonly controlService = inject(ReimbursementControlService);

  readonly sectionInput =
    viewChild.required<ElementRef<HTMLInputElement>>('sectionInput');

  form = this.controlService.participantStep;
  states: ResolvedFederation[] = [];
  filteredStates?: ResolvedFederation[];

  ngOnInit() {
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
            const isBavarianB = b.name === 'Bayern';
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

  get email() {
    return this.form.controls.email;
  }

  get iban() {
    return this.form.controls.bankAccount.controls.iban;
  }

  get bic() {
    return this.form.controls.bankAccount.controls.bic;
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
    if (!this.sectionInput()) {
      this.filteredStates = this.states;
      return;
    }

    const filterValue = this.sectionInput().nativeElement.value.toLowerCase();
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

  ibanChanged() {
    const iban = this.iban.value;
    const formatted =
      iban
        .toUpperCase()
        .replace(/\s/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') || '';
    this.form.controls.bankAccount.controls.iban.setValue(formatted);
  }
}
