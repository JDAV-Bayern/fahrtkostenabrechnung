import { IReimbursement } from 'src/domain/reimbursement';
import { Injectable } from '@angular/core';
import { PlzService } from './plz.service';
import { IExpense } from 'src/domain/expense';

export type ValidationResult = {
  isValid: boolean;
  findings: ValidationFinding[];
};

export type ValidationFinding = {
  type: 'error' | 'warning' | 'info';
  message: string;
};

@Injectable({
  providedIn: 'root'
})
export class ReimbursementValidationService {
  constructor(private readonly plzService: PlzService) {}
  public validateReimbursement(
    reimbursement: IReimbursement
  ): ValidationResult {
    const expenses = [
      ...reimbursement.expenses.to,
      ...reimbursement.expenses.at,
      ...reimbursement.expenses.from
    ];
    const findings: ValidationFinding[] = [];
    if (!reimbursement.participantDetails.name?.length) {
      findings.push({ type: 'error', message: 'Dein Name fehlt.' });
    } else {
      if (reimbursement.participantDetails.name.split(' ').length < 2) {
        findings.push({
          type: 'error',
          message: 'Bitte gib deinen Vor- und Nachnamen an.'
        });
      }
    }
    if (!reimbursement.participantDetails.street?.length) {
      findings.push({ type: 'error', message: 'Deine Straße fehlt.' });
    }
    if (!reimbursement.participantDetails.city?.length) {
      findings.push({ type: 'error', message: 'Dein Wohnort fehlt.' });
    }
    if (!reimbursement.participantDetails.zipCode?.length) {
      findings.push({ type: 'error', message: 'Deine Postleitzahl fehlt' });
    } else {
      if (!this.plzService.exists(reimbursement.participantDetails.zipCode)) {
        findings.push({
          type: 'warning',
          message: `Deine Postleitzahl (${reimbursement.participantDetails.zipCode}) ist uns unbekannt. Bitte überprüfe sie noch einmal.`
        });
      } else {
        if (
          !this.plzService.search(reimbursement.participantDetails.zipCode)[0]
            ?.isBavaria
        ) {
          findings.push({
            type: 'info',
            message: `Deine Postleitzahl (${reimbursement.participantDetails.zipCode}) liegt nicht in Bayern. Wir begrenzen daher den Erstattungsbetrag gemäß unserer Reisekostenrichtlinien auf 75,-€`
          });
        }
      }
    }
    if (!reimbursement.participantDetails.iban?.length) {
      findings.push({ type: 'error', message: 'Deine IBAN fehlt.' });
    } else {
      if (
        !reimbursement.participantDetails.iban.startsWith('DE') &&
        !reimbursement.participantDetails.bic?.length
      ) {
        findings.push({
          type: 'error',
          message: 'Bei einem auländischen Konto benötigen wir die BIC'
        });
      }
    }
    if (!reimbursement.courseDetails.courseName?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib den Namen der Schulung an.'
      });
    }
    if (!reimbursement.courseDetails.courseDate?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib das Datum der Schulung an.'
      });
    }
    if (!reimbursement.courseDetails.courseLocation?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib den Ort der Schulung an.'
      });
    }
    if (!expenses.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib mindestens eine Auslage an.'
      });
    } else {
      if (
        expenses.reduce(
          (numberOfPlanExpenses, expense) =>
            numberOfPlanExpenses + (expense.type === 'plan' ? 1 : 0),
          0
        ) > 2
      ) {
        // more than two plan expenses
        findings.push({
          type: 'error',
          message:
            'Du kannst maximal zwei Auslagen (Hin- und Rückfahrt) für Abo Tickets angeben.'
        });
      }
      if (expenses.some(expense => ['train', 'plan'].includes(expense.type))) {
        findings.push({
          type: 'info',
          message:
            'Bitte denke daran, dass wir die Belege für deine Zugtickets benötigen.'
        });
      }
      findings.push(
        ...this.checkValidityOfRoute([
          ...reimbursement.expenses.to,
          ...reimbursement.expenses.from
        ])
      );
    }
    return {
      isValid: !findings.some(finding => finding.type === 'error'),
      findings
    };
  }
  private checkValidityOfRoute(expenses: IExpense[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    let currentPosition = expenses[0].endLocation;
    for (let i = 1; i < expenses.length; i++) {
      const endPosition = expenses[i].endLocation;
      const startPosition = expenses[i].startLocation;
      if (startPosition !== currentPosition) {
        findings.push({
          type: 'warning',
          message: `Deine Abrechnung weist eine Lücke auf. Wir wissen nicht, wie Du von ${currentPosition} nach ${startPosition} gekommen bist. Wenn Du hier ein kostenfreies Verkehrsmittel benutzt hast, oder mitgefahren bist, kannst Du diese Warnung ignorieren.`
        });
      }
      currentPosition = endPosition;
    }
    return findings;
  }
}
