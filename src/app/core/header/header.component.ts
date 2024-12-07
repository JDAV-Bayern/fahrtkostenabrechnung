import { Component, inject } from '@angular/core';
import { logoBase64 } from 'src/assets/logoBase64';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';

@Component({
  selector: 'header[appHeader]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const image = document.getElementById('logo') as HTMLImageElement;
    image.src = `data:image/jpg;base64,${logoBase64}`;
  }

  deleteAllData() {
    this.controlService.deleteStoredData();
    this.router.navigate(['kurs']);
  }
}
