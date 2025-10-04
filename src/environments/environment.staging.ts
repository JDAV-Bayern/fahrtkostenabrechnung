import { Environment } from './environment.interface';

export const environment: Environment = {
  environment: 'staging',
  featureFlags: {
    enableLogin: false,
  },
};
