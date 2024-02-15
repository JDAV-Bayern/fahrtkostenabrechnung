import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from 'src/app/reimbursement.service';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css']
})
export class ExpensesCollectionComponent {
  formStep: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly reimbursementService: ReimbursementService
  ) {
    this.formStep = this.reimbursementService.expensesStep;
  }

  getSum() {
    return this.reimbursementService.getSum();
  }

  onsitePredicate(item: CdkDrag<FormControl>) {
    return item.data.value.type !== 'plan' && item.data.value.type !== 'bike';
  }

  completeReturnTrip() {
    this.reimbursementService.completeReturnTrip();
  }

  continue() {
    this.router.navigate(['zusammenfassen-und-abschicken']);
  }

  back() {
    this.router.navigate(['kurs-und-personen-infos']);
  }
}
