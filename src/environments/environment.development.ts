import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://localhost:4200',
  environment: 'development',
  backendUrl: '/api',
  authConfig: {
    issuer: 'https://staging.jdav-bayern.de/o',
    clientId: 'kUynptZkdi8hqQSYm0TmSYweE6VY3MHypyYm1Thu',
    redirectUri: 'https://localhost:4200/callback',
  },
};
