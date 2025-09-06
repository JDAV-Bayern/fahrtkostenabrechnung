export interface Environment {
  environment: 'development' | 'staging' | 'production';
}

export const environment: Environment = {
  environment: 'production'
};
