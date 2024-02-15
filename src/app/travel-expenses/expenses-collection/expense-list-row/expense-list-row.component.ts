import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { FormGroup } from '@angular/forms';
import { ReimbursementService } from 'src/app/reimbursement.service';

@Component({
  selector: 'app-expense-list-row',
  templateUrl: './expense-list-row.component.html',
  styleUrls: ['./expense-list-row.component.css']
})
export class ExpenseListRowComponent {
  @Output()
  deleteRow = new EventEmitter<number>();

  @Input({ required: true })
  form!: FormGroup;

  @Input({ required: true })
  index!: number;

  constructor(
    private reimbursementService: ReimbursementService,
    private readonly dialog: MatDialog
  ) {}

  get type() {
    return this.form.get('type')!.value as string;
  }

  get origin() {
    return this.form.get('from')?.value as string;
  }

  get destination() {
    return this.form.get('to')?.value as string;
  }

  get distance() {
    return this.form.get('distance')?.value as string;
  }

  get discount() {
    return this.form.get('discountCard')?.value as string;
  }

  get passengerCount() {
    const passengers = this.form.get('passengers')?.value as string;
    return passengers.length > 0 ? passengers.split(',').length : 0;
  }

  editMe() {
    this.dialog.open(AddExpenseModalComponent, {
      data: { form: this.form },
      width: '80%'
    });
  }

  deleteMe() {
    this.deleteRow.emit(this.index);
  }

  getTitle() {
    let title: string;
    switch (this.type) {
      case 'car':
        title = 'Autofahrt';
        break;
      case 'train':
        title = 'Zugfahrt';
        break;
      case 'plan':
        title = 'Fahrt mit ÖPNV-Abo';
        break;
      case 'bike':
        title = 'Fahrradfahrt';
        break;
      default:
        title = '';
    }
    return title;
  }

  getDiscount(discount: string) {
    switch (discount) {
      case 'BC50':
        return 'BahnCard 50';
      case 'BC25':
        return 'BahnCard 25';
      default:
        return 'keine BahnCard';
    }
  }

  getAmount() {
    return this.reimbursementService
      .getExpense(this.form.value)
      .totalReimbursement()
      .toFixed(2);
  }

  getDetails() {
    let details: string;
    switch (this.type) {
      case 'car':
        details = `${this.distance} km, ${this.passengerCount} Mitfahrer*innen`;
        break;
      case 'train':
        details = `${this.getDiscount(this.discount)}`;
        break;
      case 'bike':
        details = `${this.distance} km`;
        break;
      default:
        details = '';
    }
    return details;
  }
}
