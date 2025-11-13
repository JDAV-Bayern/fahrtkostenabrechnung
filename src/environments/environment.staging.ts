import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://stage.portal.jdav-bayern.de',
  environment: 'staging',
  featureFlags: {
    enableLogin: false,
  },
  backendUrl: 'https://api.staging.jdav-bayern.de',
};
