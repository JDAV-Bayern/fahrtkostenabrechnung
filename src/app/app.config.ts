import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { de } from 'date-fns/locale';
import { environment } from 'src/environments/environment';
import { Configuration } from './api';
import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { JdavDatepickerIntl } from './core/date-time-intl';

export const DIALOG_CONFIG: DialogConfig = {
  panelClass: 'dialog',
  hasBackdrop: true,
  autoFocus: 'first-tabbable',
  restoreFocus: true,
  maxWidth: '80vw',
  maxHeight: '90vh',
  width: '700px'
};

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['d.M.yy', 'd.M.yyyy'],
    timeInput: 'p'
  },
  display: {
    dateInput: 'P',
    timeInput: 'p',
    monthYearLabel: 'LLL uuuu',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'LLLL uuuu',
    timeOptionLabel: 'p'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(authConfig),
    provideRouter(
      routes,
      ...(environment.useHashRouting ? [withHashLocation()] : [])
    ),
    provideAnimations(),
    provideDateFnsAdapter(DATE_FORMATS),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: DIALOG_CONFIG },
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: MatDatepickerIntl, useClass: JdavDatepickerIntl },
    {
      provide: Configuration,
      useValue: new Configuration({
        basePath: environment.backendBaseUrl,
        withCredentials: true
      })
    },
    provideHttpClient(withInterceptors([authInterceptor()]))
  ]
};
