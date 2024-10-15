import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subscription, switchMap } from 'rxjs';
import { CountryService } from 'src/app/core/country.service';
import { LocalityService } from 'src/app/core/locality.service';
import { Country } from 'src/domain/address.model';

const PLZ_PATTERN = /^[0-9]{4,5}$/;

@Component({
  selector: 'app-form-address',
  standalone: true,
  imports: [ReactiveFormsModule, MatAutocompleteModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormAddressComponent),
      multi: true
    }
  ],
  templateUrl: './form-address.component.html',
  styleUrl: './form-address.component.css'
})
export class FormAddressComponent implements ControlValueAccessor {
  form = this.formBuilder.group({
    line1: ['', Validators.required],
    // line2: new FormControl<string | null>(null),
    postalCode: ['', [Validators.required, Validators.pattern(PLZ_PATTERN)]],
    locality: ['', Validators.required],
    countryId: new FormControl<number | null>(null, Validators.required)
  });

  onChangeSub?: Subscription;
  onTouched: () => void = () => {};

  @ViewChild('countryInput')
  countryInput?: ElementRef<HTMLInputElement>;
  countries: Country[] = [];
  filteredCountries?: Country[];

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly countryService: CountryService,
    private readonly localityService: LocalityService
  ) {
    // autcomplete locality
    this.postalCode.valueChanges
      .pipe(switchMap(value => this.localityService.search(value)))
      .subscribe(results => {
        if (results.length === 1) {
          const locality = results[0];
          this.locality.setValue(locality.name);
          this.countryId.setValue(locality.countryId);
        }
      });

    // load country autocomplete
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
      this.filter();
    });
  }

  get line1() {
    return this.form.controls.line1;
  }

  get postalCode() {
    return this.form.controls.postalCode;
  }

  get locality() {
    return this.form.controls.locality;
  }

  get countryId() {
    return this.form.controls.countryId;
  }

  writeValue(val: any): void {
    val && this.form.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: (val: any) => void): void {
    this.onChangeSub && this.onChangeSub.unsubscribe();
    this.onChangeSub = this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  filter() {
    if (!this.countryInput) {
      this.filteredCountries = this.countries;
      return;
    }

    const filterValue = this.countryInput.nativeElement.value.toLowerCase();
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (value: number) =>
    this.countries.find(country => country.id === value)?.name || '';
}
