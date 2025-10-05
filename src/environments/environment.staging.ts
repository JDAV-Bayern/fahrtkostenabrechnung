import { Environment } from './environment.interface';

export const environment: Environment = {
  environment: 'staging',
  featureFlags: {
    enableLogin: false,
  },
  backendUrl: 'https://api.staging.jdav-bayern.de',
};
