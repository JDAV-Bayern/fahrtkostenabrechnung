import { Environment } from './environment.interface';

export const environment: Environment = {
  origin: 'https://stage.portal.jdav-bayern.de',
  environment: 'staging',
  backendUrl: 'https://api.staging.jdav-bayern.de',
  authConfig: {
    issuer: 'https://jdav-bayern.de/o',
    clientId: 'JiUBP3Tjoh8AQRKkFkp8uNdhsBqi9iEuRyEi07FG',
    redirectUri: 'https://stage.portal.jdav-bayern.de/callback',
  },
};
