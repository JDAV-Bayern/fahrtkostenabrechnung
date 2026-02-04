import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://portal.jdav-bayern.de',
  environment: 'production',
  backendUrl: 'https://portal.jdav-bayern.de/api',
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
    clientId: 'T4uyucXn9osISOJugiDTpmBu43jCbJTAMl0MEi8i',
    redirectUri: 'https://portal.jdav-bayern.de/callback',
  },
};
