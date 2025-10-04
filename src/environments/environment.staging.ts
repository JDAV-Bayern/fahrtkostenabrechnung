import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://stage.portal.jdav-bayern.de',
  environment: 'staging',
  backendUrl: 'https://api.staging.jdav-bayern.de',
  authConfig: {
    issuer: 'https://jdav-bayern.de/o',
    /* 
    This client_id is for a public OAuth/OIDC SPA client.
    Public SPAs cannot keep secrets, so the client_id is not sensitive.
    It must be visible to the browser during the OAuth flow anyway.

    Security is provided by:
    - redirect URI restrictions,
    - PKCE,
    - scopes/permissions on the authorization server.

    This is standard practice and does not expose any sensitive data.
    */
    clientId: 'JiUBP3Tjoh8AQRKkFkp8uNdhsBqi9iEuRyEi07FG',
    redirectUri: 'https://stage.portal.jdav-bayern.de/callback',
  },
};
