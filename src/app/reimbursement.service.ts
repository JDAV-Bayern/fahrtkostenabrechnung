import { Injectable } from '@angular/core';
import { IExpense, getDomainObjectFromSerializedData } from 'src/domain/expense';
import { IReimbursement } from 'src/domain/reimbursement';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  constructor() { }

  private loadFromLocalStorage(): IReimbursement {
    const localStorageDate = localStorage.getItem('formDate');
    const formDate = localStorageDate ? new Date(localStorageDate) : new Date();
    const expenses: IExpense[] = [];
    const expensesJson = JSON.parse(localStorage.getItem('expenses') || '[]') as string[];
    expensesJson.forEach(expenseJson => {
      expenses.push(getDomainObjectFromSerializedData(expenseJson));
    });
    return {
      id: localStorage.getItem('id') || '',
      participantDetails: {
        name: localStorage.getItem('name') || '',
        street: localStorage.getItem('street') || '',
        city: localStorage.getItem('city') || '',
        iban: localStorage.getItem('iban') || '',

      },
      courseDetails: {
        id: localStorage.getItem('courseId') || '',
        courseName: ''
      },
      expenses,
      formDate
    };
  }

  private storeToLocalStorage(reimbursement: IReimbursement) {
    localStorage.setItem('id', reimbursement.id);
    localStorage.setItem('name', reimbursement.participantDetails.name);
    localStorage.setItem('street', reimbursement.participantDetails.street);
    localStorage.setItem('city', reimbursement.participantDetails.city);
    localStorage.setItem('iban', reimbursement.participantDetails.iban);
    localStorage.setItem('courseId', reimbursement.courseDetails.id);
    localStorage.setItem('formDate', reimbursement.formDate.toISOString());
    localStorage.setItem('expenses', JSON.stringify(reimbursement.expenses.map(expense => expense.serialize())));
  }

  setPersonalInformation(name: string, street: string, city: string, course: string) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.participantDetails.name = name;
    reimbursement.participantDetails.street = street;
    reimbursement.participantDetails.city = city;
    reimbursement.courseDetails.id = course;
    this.storeToLocalStorage(reimbursement);
  }

  setExpenses(expenses: IExpense[]) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.expenses = expenses;
    this.storeToLocalStorage(reimbursement);
  }

  setSubmitInformation(iban: string) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.participantDetails.iban = iban;
    reimbursement.formDate = new Date();
    this.storeToLocalStorage(reimbursement);
  }

  getReimbursment(): IReimbursement {
    return this.loadFromLocalStorage();
  }


}
