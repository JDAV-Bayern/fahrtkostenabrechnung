import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.authConfig?.issuer,
    secureRoutes: [environment.backendUrl ?? '/api'],
    authWellknownEndpoints: {
      // We need this proxy for now as CORS setup is not working on the identity provider
      userInfoEndpoint: environment.origin + '/auth-proxy/userinfo/',
      tokenEndpoint: environment.origin + '/auth-proxy/token/',
    },
    redirectUrl: environment.authConfig?.redirectUri,
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.authConfig?.clientId,
    scope: 'read openid email profile participations',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    logLevel: LogLevel.Warn,
  },
};
