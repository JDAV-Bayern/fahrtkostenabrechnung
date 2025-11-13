import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://portal.jdav-bayern.de',
  environment: 'production',
  backendUrl: 'https://api.portal.jdav-bayern.de',
  authConfig: {
    issuer: 'https://jdav-bayern.de/o',
    clientId: 'T4uyucXn9osISOJugiDTpmBu43jCbJTAMl0MEi8i',
    redirectUri: 'https://portal.jdav-bayern.de/callback',
  },
};
