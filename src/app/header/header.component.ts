import { Component } from '@angular/core';
import { ReimbursementService } from '../reimbursement.service';
import { logoBase64 } from 'src/assets/logoBase64';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private readonly reimbursementService: ReimbursementService) { }
  ngOnInit(): void {
    const image = document.getElementById("logo") as HTMLImageElement;
    image.src = `data:image/jpg;base64,${logoBase64}`;
  }
  deleteAllData() {
    this.reimbursementService.deleteStoredData();
  }

}
