import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://login.portal.jdav-bayern.de',
    redirectUrl: window.location.origin + '/callback',
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.clientId,
    scope: 'openid profile email',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30
  }
};
