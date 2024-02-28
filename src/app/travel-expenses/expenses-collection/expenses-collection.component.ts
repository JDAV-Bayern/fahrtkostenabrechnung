import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReimbursementService } from 'src/app/reimbursement.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-expenses-collection',
  templateUrl: './expenses-collection.component.html',
  styleUrls: ['./expenses-collection.component.css']
})
export class ExpensesCollectionComponent {
  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly reimbursementService: ReimbursementService
  ) {}

  getSum() {
    return this.reimbursementService.getSum();
  }

  continue() {
    this.router.navigate(['zusammenfassen-und-abschicken']);
  }

  back() {
    this.router.navigate(['kurs-und-personen-infos']);
  }
}
