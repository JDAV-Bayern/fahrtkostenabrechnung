import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';
import {
  IExpense,
  getDomainObjectFromSerializedData
} from 'src/domain/expense';
import { IReimbursement } from 'src/domain/reimbursement';
import { PlzService } from './plz.service';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  travelExpensesForm = this.formBuilder.group({
    personalInformation: this.formBuilder.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      city: ['', Validators.required],
      course: this.formBuilder.group({
        code: ['', Validators.required],
        name: ['', Validators.required],
        date: ['', Validators.required],
        location: ['', Validators.required]
      })
    }),
    expenses: this.formBuilder.group({
      expensesTo: this.formBuilder.array([]),
      expensesAt: this.formBuilder.array([]),
      expensesFrom: this.formBuilder.array([])
    }),
    overview: this.formBuilder.group({
      iban: ['', [Validators.required, validateIBAN]],
      bic: [''],
      note: [''],
      file: [undefined]
    })
  });

  constructor(
    private formBuilder: FormBuilder,
    private plzService: PlzService
  ) {}

  getFormStep(step: string): FormGroup {
    return this.travelExpensesForm.get(step) as FormGroup;
  }

  loadForm() {
    const travelExpensesData = localStorage.getItem('travelExpenses') || '{}';
    const travelExpenses = JSON.parse(travelExpensesData);
    this.travelExpensesForm.patchValue(travelExpenses);
  }

  saveForm() {
    // TODO: exclude file field?
    const travelExpensesData = JSON.stringify(this.travelExpensesForm.value);
    localStorage.setItem('travelExpenses', travelExpensesData);
  }

  getExpenses(): IExpense[] {
    const expensesData = localStorage.getItem('expenses') || '[]';
    const expensesJson = JSON.parse(expensesData) as string[];
    const expenses = expensesJson.map(expenseJson =>
      getDomainObjectFromSerializedData(expenseJson)
    );
    return expenses;
  }

  setExpenses(expenses: IExpense[]) {
    localStorage.setItem(
      'expenses',
      JSON.stringify(expenses.map(expense => expense.serialize()))
    );
  }

  getReimbursment(): IReimbursement {
    const v = this.travelExpensesForm.value;
    const plzInfo = this.plzService.search(
      v.personalInformation?.zipCode || ''
    );

    return {
      id: '',
      formDate: new Date(),
      courseDetails: {
        id: v.personalInformation?.course?.code || '',
        courseName: v.personalInformation?.course?.name || '',
        courseDate: v.personalInformation?.course?.date || '',
        courseLocation: v.personalInformation?.course?.location || ''
      },
      participantDetails: {
        name: v.personalInformation?.name || '',
        street: v.personalInformation?.street || '',
        zipCode: v.personalInformation?.zipCode || '',
        city: v.personalInformation?.city || '',
        isBavaria: plzInfo.length > 0 ? plzInfo[0].isBavaria : false,
        iban: v.overview?.iban || '',
        bic: v.overview?.bic || ''
      },
      expenses: this.getExpenses(),
      note: v.overview?.note || ''
    };
  }

  deleteStoredData(): void {
    localStorage.removeItem('travelExpenses');
    localStorage.removeItem('expenses');
  }
}
