import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.authConfig?.issuer,
    secureRoutes: [environment.backendUrl ?? ''],
    redirectUrl: environment.authConfig?.redirectUri,
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.authConfig?.clientId,
    scope: environment.authConfig?.scopes.join(' '),
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  },
};
