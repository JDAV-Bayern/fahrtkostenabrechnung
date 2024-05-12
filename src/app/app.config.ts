import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats
} from '@angular/material/core';
import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { JdavDateAdapter } from './core/date-adapter';
import { MatDatepickerIntl } from '@angular/material/datepicker';
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
    dateInput: /^(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})$/
  },
  display: {
    dateInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: '2-digit' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    { provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: DIALOG_CONFIG },
    { provide: DateAdapter, useClass: JdavDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: MatDatepickerIntl, useClass: JdavDatepickerIntl }
  ]
};
