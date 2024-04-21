import { Travel } from 'src/domain/travel.model';
import { Injectable } from '@angular/core';
import { TransportExpense } from 'src/domain/expense.model';
import { PlzService } from 'src/app/core/plz.service';

@Injectable({
  providedIn: 'root'
})
export class TravelValidatorService {
  constructor(private readonly plzService: PlzService) {}

  public validateTravel(travel: Travel): string[] {
    const findings: string[] = [];

    // Check if zip code exists and if it is in bavaria
    const plz = travel.participant.zipCode;
    const city = travel.participant.city;
    if (!this.plzService.exists(plz, city)) {
      findings.push(
        `Dein Wohnort (${plz} ${city}) ist uns unbekannt. Bitte überprüfe deine Angaben noch einmal.`
      );
    }

    // check that the route is complete
    const transportExpenses = travel.expenses.transport;
    findings.push(
      ...this.checkValidityOfRoute([
        ...transportExpenses.inbound,
        ...transportExpenses.outbound
      ])
    );

    return findings;
  }

  private checkValidityOfRoute(expenses: TransportExpense[]): string[] {
    const findings: string[] = [];
    let currentPosition = expenses[0]?.destination;
    for (let i = 1; i < expenses.length; i++) {
      const endPosition = expenses[i].destination;
      const startPosition = expenses[i].origin;
      if (startPosition !== currentPosition) {
        findings.push(
          `Deine Abrechnung weist eine Lücke auf. Wir wissen nicht, wie Du von ${currentPosition} nach ${startPosition} gekommen bist. Wenn Du hier ein kostenfreies Verkehrsmittel benutzt hast, oder mitgefahren bist, kannst Du diese Warnung ignorieren.`
        );
      }
      currentPosition = endPosition;
    }
    return findings;
  }
}
