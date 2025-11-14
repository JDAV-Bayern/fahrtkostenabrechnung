export interface Environment {
  origin: string;
  environment: 'development' | 'staging' | 'production';
  authConfig?: {
    issuer: string;
    clientId: string;
    redirectUri: string;
  };
  backendUrl?: string;
}
