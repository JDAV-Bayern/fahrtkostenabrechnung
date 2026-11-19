import { DialogRef } from '@angular/cdk/dialog';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import {
  applyEach,
  form,
  FormField,
  FormRoot,
  hidden,
  min,
  required,
} from '@angular/forms/signals';
import {
  buildTransportExpense,
  draftFromTransportExpense,
  emptyTransportDraft,
} from 'src/app/reimbursement/shared/expense-draft';
import { TransportExpenseCompletion } from 'src/app/reimbursement/shared/reimbursement-form.service';
import { Button } from 'src/app/shared/ui/button';
import { TransportExpense, TransportMode } from 'src/domain/expense.model';
import { TransportModePipe } from '../shared/transport-mode.pipe';

@Component({
  selector: 'app-transport-expense-modal',
  templateUrl: './transport-expense-modal.component.html',
  styleUrls: ['./transport-expense-modal.component.css'],
  imports: [Button, FormField, FormRoot, TransportModePipe],
})
export class TransportExpenseModalComponent implements OnInit {
  private readonly dialogRef = inject<DialogRef<TransportExpense>>(DialogRef);
  private readonly injector = inject(Injector);

  /** The expense to edit, a new expense is created without it. */
  readonly expense = input<TransportExpense>();
  readonly allowedModes = input<TransportMode[]>();
  readonly completion = input<TransportExpenseCompletion>();

  passengerInputs =
    viewChildren<ElementRef<HTMLInputElement>>('passengerInput');

  private readonly draft = signal(emptyTransportDraft());

  // Only the fields of the selected mode are part of the form.
  form = form(this.draft, (p) => {
    required(p.mode);
    required(p.origin);
    required(p.destination);

    hidden(p.distance, {
      when: ({ valueOf }) => !['car', 'bike'].includes(valueOf(p.mode) ?? ''),
    });
    required(p.distance);
    min(p.distance, 0);

    hidden(p.ticket, { when: ({ valueOf }) => valueOf(p.mode) !== 'public' });
    required(p.ticket.price);
    min(p.ticket.price, 0);
    required(p.ticket.discount);

    hidden(p.carTrip, { when: ({ valueOf }) => valueOf(p.mode) !== 'car' });
    required(p.carTrip.engineType);
    applyEach(p.carTrip.passengers, (passenger) => required(passenger));
  });

  ngOnInit() {
    const expense = this.expense();
    if (expense) {
      this.draft.set(draftFromTransportExpense(expense));
    }
  }

  chooseExpense(mode: TransportMode) {
    this.form.mode().value.set(mode);

    const completion = this.completion();
    if (!completion) return;

    if (completion.origin) this.form.origin().value.set(completion.origin);
    if (completion.engineType)
      this.form.carTrip.engineType().value.set(completion.engineType);
    if (completion.discount)
      this.form.ticket.discount().value.set(completion.discount);
  }

  addPassenger() {
    this.form.carTrip.passengers().value.update((list) => [...list, '']);

    // focus the new input once it is rendered
    afterNextRender(
      () => {
        const inputs = this.passengerInputs();
        inputs[inputs.length - 1]?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  removePassenger(index: number) {
    this.form.carTrip
      .passengers()
      .value.update((list) => list.filter((_, i) => i !== index));
  }

  submitForm() {
    this.dialogRef.close(buildTransportExpense(this.draft()));
  }
}
