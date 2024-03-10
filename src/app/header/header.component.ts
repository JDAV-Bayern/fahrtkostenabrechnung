import { Component } from '@angular/core';
import { ReimbursementControlService } from '../reimbursement-control.service';
import { logoBase64 } from 'src/assets/logoBase64';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private readonly controlService: ReimbursementControlService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {
    const image = document.getElementById('logo') as HTMLImageElement;
    image.src = `data:image/jpg;base64,${logoBase64}`;
  }
  deleteAllData() {
    this.controlService.deleteStoredData();
    this.router.navigate(['kurs']);
  }
}
