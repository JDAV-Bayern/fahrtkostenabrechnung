import { Component } from '@angular/core';
import { ReimbursementService } from '../reimbursement.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private readonly reimbursementService: ReimbursementService) { }
  deleteAllData() {
    this.reimbursementService.deleteStoredData();
  }

}
