import { computed, inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ProfileData } from './auth-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly securityService = inject(OidcSecurityService);

  readonly isAuthenticated = computed(
    () => this.securityService.authenticated().isAuthenticated,
  );
  readonly userData = computed<ProfileData | undefined>(
    () => this.securityService.userData().userData,
  );

  logout() {
    this.securityService.logoffLocal();
  }
}
