import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  untracked,
  viewChild,
} from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { PlzService } from 'src/app/core/plz.service';
import { SectionService } from 'src/app/core/section.service';
import { ReimbursementFormService } from 'src/app/reimbursement/shared/reimbursement-form.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JdavState } from 'src/domain/section.model';

@Component({
  selector: 'app-participant-step',
  templateUrl: './participant-step.component.html',
  styleUrls: ['./participant-step.component.css'],
  imports: [RouterLink, FormField, MatAutocompleteModule],
})
export class ParticipantStepComponent implements OnInit {
  private readonly plzService = inject(PlzService);
  private readonly sectionService = inject(SectionService);
  private readonly formService = inject(ReimbursementFormService);

  readonly sectionInput =
    viewChild.required<ElementRef<HTMLInputElement>>('sectionInput');

  form = this.formService.form.participant;
  states: JdavState[] = [];
  filteredStates: JdavState[] = [];

  constructor() {
    // Format the IBAN as it is typed. This is not done in an input handler:
    // the form field updates its value in its own input listener, which may run
    // after the one of the template.
    effect(() => {
      const iban = this.form.iban().value();
      const formatted = this.formatIban(iban);
      if (formatted !== iban) {
        untracked(() => this.form.iban().value.set(formatted));
      }
    });
  }

  ngOnInit() {
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
    this.states.forEach((state) => {
      state.sections.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.filteredStates = this.states.slice();
  }

  filter() {
    const filterValue = this.sectionInput().nativeElement.value.toLowerCase();
    const filteredStates = this.states.map((state) => ({
      id: state.id,
      name: state.name,
      sections: state.sections.filter((section) =>
        section.name.toLowerCase().includes(filterValue),
      ),
    }));
    this.filteredStates = filteredStates.filter(
      (state) => state.sections.length > 0,
    );
  }

  displayFn() {
    return (item: number) => this.sectionService.getSection(item)?.name || '';
  }

  plzChanged() {
    const plz = this.form.zipCode().value();
    const results = this.plzService.search(plz);
    if (results.length === 1) {
      this.form.city().value.set(results[0].city);
    }
  }

  private formatIban(iban: string) {
    return (
      iban
        .toUpperCase()
        .replace(/\s/g, '')
        .match(/.{1,4}/g)
        ?.join(' ') || ''
    );
  }
}
