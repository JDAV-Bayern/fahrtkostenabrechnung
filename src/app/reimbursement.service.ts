import { Injectable } from '@angular/core';
import {
  IExpense,
  getDomainObjectFromSerializedData
} from 'src/domain/expense';
import { IReimbursement } from 'src/domain/reimbursement';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  constructor() {}

  private loadFromLocalStorage(): IReimbursement {
    const localStorageDate = localStorage.getItem('formDate');
    const formDate = localStorageDate ? new Date(localStorageDate) : new Date();
    const expenses: IExpense[] = [];
    const expensesJson = JSON.parse(
      localStorage.getItem('expenses') || '[]'
    ) as string[];
    expensesJson.forEach((expenseJson) => {
      expenses.push(getDomainObjectFromSerializedData(expenseJson));
    });
    return {
      id: localStorage.getItem('id') || '',
      participantDetails: {
        name: localStorage.getItem('name') || '',
        street: localStorage.getItem('street') || '',
        city: localStorage.getItem('city') || '',
        iban: localStorage.getItem('iban') || '',
        zipCode: localStorage.getItem('zipCode') || '',
        isBavaria: localStorage.getItem('isBavaria') === 'true'
      },
      courseDetails: {
        id: localStorage.getItem('courseId') || '',
        courseDate: localStorage.getItem('courseDate') || '',
        courseLocation: localStorage.getItem('courseLocation') || '',
        courseName: localStorage.getItem('courseName') || ''
      },
      expenses,
      formDate,
      note: localStorage.getItem('note') || ''
    };
  }

  private storeToLocalStorage(reimbursement: IReimbursement) {
    localStorage.setItem('id', reimbursement.id);
    localStorage.setItem('name', reimbursement.participantDetails.name);
    localStorage.setItem('street', reimbursement.participantDetails.street);
    localStorage.setItem('city', reimbursement.participantDetails.city);
    localStorage.setItem('iban', reimbursement.participantDetails.iban);
    localStorage.setItem('courseId', reimbursement.courseDetails.id);
    localStorage.setItem('courseName', reimbursement.courseDetails.courseName);
    localStorage.setItem('courseDate', reimbursement.courseDetails.courseDate);
    localStorage.setItem(
      'courseLocation',
      reimbursement.courseDetails.courseLocation
    );
    localStorage.setItem('formDate', reimbursement.formDate.toISOString());
    localStorage.setItem(
      'expenses',
      JSON.stringify(
        reimbursement.expenses.map((expense) => expense.serialize())
      )
    );
    localStorage.setItem('zipCode', reimbursement.participantDetails.zipCode);
    localStorage.setItem(
      'isBavaria',
      reimbursement.participantDetails.isBavaria.toString()
    );
    localStorage.setItem('note', reimbursement.note);
  }

  setPersonalAndCourseInformation(
    name: string,
    street: string,
    city: string,
    course: string,
    courseName: string,
    courseDate: string,
    courseLocation: string,
    zipCode: string,
    isBavaria: boolean
  ) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.participantDetails.name = name;
    reimbursement.participantDetails.street = street;
    reimbursement.participantDetails.city = city;
    reimbursement.courseDetails.id = course;
    reimbursement.courseDetails.courseName = courseName;
    reimbursement.courseDetails.courseDate = courseDate;
    reimbursement.courseDetails.courseLocation = courseLocation;
    reimbursement.participantDetails.zipCode = zipCode;
    reimbursement.participantDetails.isBavaria = isBavaria;
    this.storeToLocalStorage(reimbursement);
  }

  setExpenses(expenses: IExpense[]) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.expenses = expenses;
    this.storeToLocalStorage(reimbursement);
  }

  setSubmitInformation(iban: string, bic: string, note: string) {
    const reimbursement = this.loadFromLocalStorage();
    reimbursement.participantDetails.iban = iban;
    reimbursement.participantDetails.bic = bic;
    reimbursement.formDate = new Date();
    reimbursement.note = note;
    this.storeToLocalStorage(reimbursement);
  }

  getReimbursment(): IReimbursement {
    return this.loadFromLocalStorage();
  }

  deleteStoredData(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('street');
    localStorage.removeItem('city');
    localStorage.removeItem('iban');
    localStorage.removeItem('courseId');
    localStorage.removeItem('formDate');
    localStorage.removeItem('expenses');
    localStorage.removeItem('courseName');
    localStorage.removeItem('courseDate');
    localStorage.removeItem('courseLocation');
    localStorage.removeItem('zipCode');
    localStorage.removeItem('isBavaria');
    localStorage.removeItem('note');
  }
}
