import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { logoBase64 } from 'src/assets/logoBase64';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const image = document.getElementById('logo') as HTMLImageElement;
    image.src = `data:image/jpg;base64,${logoBase64}`;
  }

  deleteAllData() {
    const originUrl: string =
      {
        course: 'kurs',
        assembly: 'ljv',
        committee: 'gremium'
      }[
        this.controlService.meetingStep.value.type as
          | 'course'
          | 'assembly'
          | 'committee'
      ] ?? 'kurs';
    this.controlService.deleteStoredData();
    this.router.navigate([originUrl]);
  }
}
