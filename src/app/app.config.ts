import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
} from '@angular/router';
import {
  authInterceptor,
  provideAuth,
  withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';
import { de } from 'date-fns/locale';
import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { JdavDatepickerIntl } from './core/date-time-intl';
import { JdavTitleStrategy } from './core/title-strategy';

export const DIALOG_CONFIG: DialogConfig = {
  panelClass: 'dialog',
  hasBackdrop: true,
  autoFocus: 'first-tabbable',
  restoreFocus: true,
  maxWidth: '80vw',
  maxHeight: '90vh',
  width: '700px',
};

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['d.M.yy', 'd.M.yyyy'],
    timeInput: 'p',
  },
  display: {
    dateInput: 'P',
    timeInput: 'p',
    monthYearLabel: 'LLL uuuu',
    dateA11yLabel: 'PP',
    monthYearA11yLabel: 'LLLL uuuu',
    timeOptionLabel: 'p',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(authConfig, withAppInitializerAuthCheck()),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideDateFnsAdapter(DATE_FORMATS),
    provideHttpClient(withInterceptors([authInterceptor()])),
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: DIALOG_CONFIG },
    { provide: MAT_DATE_LOCALE, useValue: de },
    { provide: MatDatepickerIntl, useClass: JdavDatepickerIntl },
    { provide: TitleStrategy, useClass: JdavTitleStrategy },
  ],
};
