import { Reimbursement } from 'src/domain/reimbursement';
import { Injectable } from '@angular/core';
import { PlzService } from './plz.service';
import { Expense } from 'src/domain/expense';
import { SectionService } from './section.service';

export type ValidationFinding = {
  type: 'warning' | 'info';
  message: string;
};

@Injectable({
  providedIn: 'root'
})
export class ReimbursementValidationService {
  constructor(
    private readonly plzService: PlzService,
    private readonly sectionService: SectionService
  ) {}

  public validateReimbursement(
    reimbursement: Reimbursement
  ): ValidationFinding[] {
    const findings: ValidationFinding[] = [];

    // Check if participant first and last name are given
    if (reimbursement.participant.name.split(' ').length < 2) {
      findings.push({
        type: 'warning',
        message: 'Bitte gib deinen Vor- und Nachnamen an.'
      });
    }

    // Check if section is in Bavaria
    const sectionId = reimbursement.participant.sectionId;
    const section = sectionId
      ? this.sectionService.getSection(sectionId)!
      : undefined;
    if (section && !this.sectionService.isBavarian(section)) {
      findings.push({
        type: 'info',
        message: `Deine Sektion (${section.name}) liegt nicht in Bayern. Wir begrenzen daher den Erstattungsbetrag gemäß unserer Reisekostenrichtlinien auf 75,-€`
      });
    }

    // Check if zip code exists and if it is in bavaria
    if (!this.plzService.exists(reimbursement.participant.zipCode)) {
      findings.push({
        type: 'warning',
        message: `Deine Postleitzahl (${reimbursement.participant.zipCode}) ist uns unbekannt. Bitte überprüfe sie noch einmal.`
      });
    }

    const expenses = [
      ...reimbursement.expenses.inbound,
      ...reimbursement.expenses.onsite,
      ...reimbursement.expenses.outbound
    ];

    // check if there are train or plan expenses
    if (expenses.some(expense => ['train', 'plan'].includes(expense.type))) {
      findings.push({
        type: 'info',
        message:
          'Bitte denke daran, dass wir die Belege für deine Zugtickets benötigen.'
      });
    }

    // check that the route is complete
    findings.push(
      ...this.checkValidityOfRoute([
        ...reimbursement.expenses.inbound,
        ...reimbursement.expenses.outbound
      ])
    );

    return findings;
  }

  private checkValidityOfRoute(expenses: Expense[]): ValidationFinding[] {
    const findings: ValidationFinding[] = [];
    let currentPosition = expenses[0].destination;
    for (let i = 1; i < expenses.length; i++) {
      const endPosition = expenses[i].destination;
      const startPosition = expenses[i].origin;
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
