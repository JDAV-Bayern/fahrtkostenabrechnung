export interface Environment {
  environment: 'development' | 'staging' | 'production';
  featureFlags: {
    enableLogin: boolean;
  };
  authConfig?: {
    issuer: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
  backendUrl?: string;
}
