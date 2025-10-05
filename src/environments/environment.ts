import { Environment } from './environment.interface';

export const environment: Environment = {
  environment: 'production',
  featureFlags: {
    enableLogin: false,
  },
  backendUrl: 'https://api.portal.jdav-bayern.de',
};
