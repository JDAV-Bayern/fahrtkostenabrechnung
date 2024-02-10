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
    const findings: ValidationFinding[] = [];
    if (!reimbursement.participantDetails.givenname?.length) {
      findings.push({ type: 'error', message: 'Dein Vorname fehlt.' });
    }
    if (!reimbursement.participantDetails.surname?.length) {
      findings.push({ type: 'error', message: 'Dein Nachname fehlt' });
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
        message: 'Bitte gib den Namen des Kurses an.'
      });
    }
    if (!reimbursement.courseDetails.id?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib die Kursnummer an.'
      });
    } else {
      if (reimbursement.courseDetails.id.match(/B\d+(FB|AM)/) === null)
        findings.push({
          type: 'error',
          message:
            'Kursnummern von Kursen der JDAV Bayern folgen dem Format BXXXFB oder BXXXAM. Bitte überprüfe die Kursnummer noch einmal und stelle sicher, dass Du einen Kurs der JDAV Bayern besucht hast und nicht einen eines anderen Landesverbandes oder dem Bundesverband.'
        });
      if (reimbursement.courseDetails.id.match(/B\d{3}(FB|AM)/) === null)
        findings.push({
          type: 'warning',
          message:
            'Kursnummern von Kursen der JDAV Bayern folgen normalerweise dem Format BXXXFB oder BXXXAM mit einer dreistelligen Zahl. Deine Kursnummer weicht davon ab. Bitte überprüfe die Kursnummer noch einmal.'
        });
    }
    if (!reimbursement.courseDetails.courseDate?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib das Datum des Kurses an.'
      });
    }
    if (!reimbursement.courseDetails.courseLocation?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib den Ort des Kurses an.'
      });
    }
    if (!reimbursement.expenses?.length) {
      findings.push({
        type: 'error',
        message: 'Bitte gib mindestens eine Auslage an.'
      });
    } else {
      if (
        reimbursement.expenses.reduce(
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
      if (
        reimbursement.expenses.some(expense =>
          ['train', 'plan'].includes(expense.type)
        )
      ) {
        findings.push({
          type: 'info',
          message:
            'Bitte denke daran, dass wir die Belege für deine Zugtickets benötigen.'
        });
      }
      findings.push(
        ...this.checkValidityOfRoute(
          reimbursement.expenses.filter(expense => expense.direction !== 'at')
        )
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
