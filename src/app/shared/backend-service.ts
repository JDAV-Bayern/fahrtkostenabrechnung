import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createApiClient } from './generated-types';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly baseUrl = environment.backendBaseUrl;

  private apiClient: ReturnType<typeof createApiClient> | undefined;

  private async initializeClient() {
    if (
      (await lastValueFrom(this.oidcSecurityService.checkAuth()))
        .isAuthenticated
    ) {
      const token = await lastValueFrom(
        this.oidcSecurityService.getAccessToken()
      );
      this.apiClient = createApiClient(this.baseUrl, {
        axiosConfig: {
          headers: {
            Authorizaiton: `Bearer ${token}`
          }
        }
      });
    } else {
      this.apiClient = createApiClient(this.baseUrl);
    }
    return this.apiClient;
  }

  public async getClient() {
    if (!this.apiClient) {
      return this.initializeClient();
    } else {
      return this.apiClient;
    }
  }
}
