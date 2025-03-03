import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  importProvidersFrom
} from '@angular/core';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAuth } from 'angular-auth-oidc-client';
import { de } from 'date-fns/locale';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { JdavDatepickerIntl } from './core/date-time-intl';

export const DIALOG_CONFIG: DialogConfig = {
  panelClass: 'dialog',
  hasBackdrop: true,
  maxWidth: '80vw',
  maxHeight: '90vh',
  width: '700px'
};

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['d.M.yy', 'd.M.yyyy']
  },
  display: {
    dateInput: 'P',
    monthYearLabel: 'LLL uuuu',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'LLLL uuuu'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      ...(environment.useHashRouting ? [withHashLocation()] : [])
    ),
    provideAnimations(),
    importProvidersFrom(DateFnsModule),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: DIALOG_CONFIG },
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: MatDatepickerIntl, useClass: JdavDatepickerIntl },
    provideAuth(authConfig),
    provideHttpClient()
  ]
};
