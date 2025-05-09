import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs';
import { ErrorService } from '../error/error.service';

export const isAdmin = () => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  // Check if user has the 'admin' role
  return oidcSecurityService
    .getUserData()
    .pipe(
      take(1),
      map((userData) => {
        const isAdmin = Object.hasOwn(userData?.['urn:zitadel:iam:org:project:roles'], 'admin');
        if (!isAdmin) {
          errorService.setError('Keine Berechtigung', 'Du hast keine Berechtigung diese Seite zu besuchen 🔒')
          router.navigate(['/error']);
        }
        return isAdmin;
      }
    )
    );

};
