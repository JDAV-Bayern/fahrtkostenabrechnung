import { Reimbursement } from 'src/domain/reimbursement.model';
import { Injectable, inject } from '@angular/core';
import { TransportExpense } from 'src/domain/expense.model';
import { LocalityService } from 'src/app/core/locality.service';
import { forkJoin, map, Observable, of } from 'rxjs';
import { Locality } from 'src/domain/address.model';

interface MissingRoute {
  origin: string;
  destination: string;
}

export interface ValidationWarnings {
  unknownLocality: Pick<Locality, 'postalCode' | 'name'> | null;
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
    const postalCode = reimbursement.participant.address.postalCode;
    const name = reimbursement.participant.address.locality;

    const unknownLocality = this.localityService
      .exists(postalCode, name)
      .pipe(map(exists => (exists ? null : { postalCode, name })));

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
