import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Locality, LocalityService } from 'src/app/core/locality.service';
import { TransportExpense } from 'src/domain/expense.model';
import { Reimbursement } from 'src/domain/reimbursement.model';

interface MissingRoute {
  origin: string;
  destination: string;
}

export interface ValidationWarnings {
  unknownLocality: Pick<Locality, 'postal_code' | 'name'> | null;
  incompleteRoute: MissingRoute[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReimbursementValidatorService {
  private readonly localityService = inject(LocalityService);

  public validateReimbursement(
    reimbursement: Reimbursement
  ): Observable<ValidationWarnings> {
    // Check if zip code exists
    const postal_code = reimbursement.participant.zipCode;
    const name = reimbursement.participant.city;

    const unknownLocality = this.localityService
      .exists(postal_code, name)
      .pipe(map(exists => (exists ? null : { postal_code, name })));

    // check that the route is complete
    const transportExpenses = reimbursement.expenses.transport;
    const incompleteRoute = of(
      this.checkValidityOfRoute([
        ...transportExpenses.inbound,
        ...transportExpenses.outbound
      ])
    );

    return forkJoin({
      unknownLocality,
      incompleteRoute
    });
  }

  private checkValidityOfRoute(
    expenses: TransportExpense[]
  ): MissingRoute[] | null {
    const gaps: MissingRoute[] = [];

    for (let i = 1; i < expenses.length; i++) {
      const currentPosition = expenses[i - 1].destination;
      const startPosition = expenses[i].origin;

      if (startPosition !== currentPosition) {
        gaps.push({
          origin: currentPosition,
          destination: startPosition
        });
      }
    }

    return gaps.length > 0 ? gaps : null;
  }
}
