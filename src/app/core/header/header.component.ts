import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterLink]
})
export class HeaderComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);
  private readonly oidcSecurityService = inject(OidcSecurityService);

  heading = window.location.pathname.startsWith('/admin')
    ? 'Verwaltung'
    : 'Reisekostenabrechnung';

  userName: string | undefined = undefined;
  loggedIn = false;

  logout() {
    this.oidcSecurityService.logoff().subscribe(result => console.log(result));
  }

  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, userData }) => {
        if (isAuthenticated) {
          this.loggedIn = true;
          this.userName = userData?.given_name;
        } else {
          this.loggedIn = false;
          this.userName = undefined;
        }
      });
  }

  deleteAllData() {
    const control = this.controlService.meetingStep.controls.type;
    const meetingType = control.value;

    let originUrl: string;
    switch (meetingType) {
      case 'course':
        originUrl = 'kurs';
        break;
      case 'assembly':
        originUrl = 'ljv';
        break;
      case 'committee':
        originUrl = 'gremium';
        break;
    }

    this.controlService.deleteStoredData();
    control.setValue(meetingType);
    this.router.navigate([originUrl]);
  }
}
