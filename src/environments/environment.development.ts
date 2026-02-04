import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'http://localhost:4200',
  environment: 'development',
  backendUrl: 'http://localhost:4200/api',
  authConfig: {
    issuer: 'https://staging.jdav-bayern.de/o',
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
    clientId: 'kUynptZkdi8hqQSYm0TmSYweE6VY3MHypyYm1Thu',
    redirectUri: 'http://localhost:4200/callback',
  },
};
