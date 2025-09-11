import { DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-control.service';
import {
  Discount,
  EngineType,
  TransportExpense,
  TransportMode,
} from 'src/domain/expense.model';
import { TransportModePipe } from '../shared/transport-mode.pipe';

@Component({
  selector: 'app-transport-expense-modal',
  templateUrl: './transport-expense-modal.component.html',
  styleUrls: ['./transport-expense-modal.component.css'],
  imports: [ReactiveFormsModule, TransportModePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TransportExpenseModalComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TransportExpenseModalComponent,
      multi: true,
    },
  ],
})
export class TransportExpenseModalComponent
  implements ControlValueAccessor, Validator, OnInit
{
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(DialogRef);

  allowedModes = input<TransportMode[]>();
  completion = input<TransportExpenseCompletion>();

  passengerInputs =
    viewChildren<ElementRef<HTMLInputElement>>('passengerInput');

  form = this.formBuilder.group({
    mode: new FormControl<TransportMode | null>(null, Validators.required),
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    distance: [0, [Validators.required, Validators.min(0)]],
    carTrip: this.formBuilder.group({
      engineType: ['combustion' as EngineType, Validators.required],
      passengers: this.formBuilder.array<string>([]),
    }),
    ticket: this.formBuilder.group({
      price: [0, [Validators.required, Validators.min(0)]],
      discount: ['none' as Discount, Validators.required],
    }),
  });

  onChange: (val: TransportExpense) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit() {
    this.form.controls.mode.valueChanges.subscribe((val) =>
      this.onTransportModeChanged(val),
    );
  }

  get mode() {
    return this.form.controls.mode;
  }

  get origin() {
    return this.form.controls.origin;
  }

  get destination() {
    return this.form.controls.destination;
  }

  get distance() {
    return this.form.controls.distance;
  }

  get ticket() {
    return this.form.controls.ticket;
  }

  get carTrip() {
    return this.form.controls.carTrip;
  }

  writeValue(val: Partial<TransportExpense>): void {
    if (val) {
      if ('carTrip' in val) {
        val.carTrip?.passengers?.forEach(() => this.addPassenger());
      }
      this.form.patchValue(val, { emitEvent: false });
    }
  }

  registerOnChange(fn: (val: TransportExpense) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.enableControls(this.mode.value);
    }
  }

  validate: ValidatorFn = () => {
    return this.form.valid ? null : { transportExpense: true };
  };

  chooseExpense(mode: TransportMode) {
    this.mode.setValue(mode);
  }

  addPassenger() {
    const control = this.formBuilder.control('', Validators.required);
    this.carTrip.controls.passengers.push(control);

    setTimeout(() => {
      const inputs = this.passengerInputs();
      inputs[inputs.length - 1].nativeElement.focus();
    });
  }

  removePassenger(index: number) {
    this.carTrip.controls.passengers.removeAt(index);
  }

  submitForm() {
    this.onChange({
      type: 'transport',
      ...this.form.value,
    } as TransportExpense);
    this.dialogRef.close();
  }

  private enableControls(mode: TransportMode | null) {
    // TODO: Is it fine to avoid emitting events here?
    // It might break the form state, but if we emit events other things break
    this.form.enable({ emitEvent: false });

    switch (mode) {
      case 'car':
        this.form.controls.ticket.disable();
        break;
      case 'public':
        this.form.controls.distance.disable();
        this.form.controls.carTrip.disable();
        break;
      case 'plan':
        this.form.controls.distance.disable();
        this.form.controls.carTrip.disable();
        this.form.controls.ticket.disable();
        break;
      case 'bike':
        this.form.controls.carTrip.disable();
        this.form.controls.ticket.disable();
        break;
    }
  }

  private onTransportModeChanged(value: TransportMode | null) {
    this.enableControls(value);
    const completion = this.completion();

    if (!completion) return;

    if (completion.origin) this.origin.setValue(completion.origin);
    if (completion.engineType)
      this.carTrip.controls.engineType.setValue(completion.engineType);
    if (completion.discount)
      this.ticket.controls.discount.setValue(completion.discount);
  }
}
