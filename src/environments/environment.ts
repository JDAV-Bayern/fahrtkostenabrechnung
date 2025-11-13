import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://portal.jdav-bayern.de',
  environment: 'production',
  featureFlags: {
    enableLogin: false,
  },
  backendUrl: 'https://api.portal.jdav-bayern.de',
};
