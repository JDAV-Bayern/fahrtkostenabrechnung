import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { logoBase64 } from 'src/assets/logoBase64';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class HeaderComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);
  private readonly oidcSecurityService = inject(OidcSecurityService);

  heading = window.location.pathname.startsWith('/admin')
    ? 'Verwaltung'
    : 'Reisekostenabrechnung';

  userName: string | undefined;
  loggedIn: boolean = false;

  logout() {
    this.oidcSecurityService.logoff().subscribe(result => console.log(result));
  }

  ngOnInit(): void {
    const image = document.getElementById('logo') as HTMLImageElement;
    image.src = `data:image/jpg;base64,${logoBase64}`;
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
    this.controlService.deleteStoredData();
    this.router.navigate(['kurs']);
  }
}
