import { Environment } from './environment.interface';

export const environment: Environment = {
  environment: 'development',
  featureFlags: {
    enableLogin: true,
  },
  authConfig: {
    issuer: 'https://staging.jdav-bayern.de/o',
    clientId: 'kUynptZkdi8hqQSYm0TmSYweE6VY3MHypyYm1Thu',
    redirectUri: 'http://localhost:4200/callback',
    scopes: ['read'],
  },
};
