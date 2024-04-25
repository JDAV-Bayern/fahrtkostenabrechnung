import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeFormats
} from '@danielmoncada/angular-datetime-picker';
import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SelectConfig } from './core/ng-select.config';
import { JdavDateTimeAdapter } from './core/date-time-adapter';

export const DIALOG_CONFIG: DialogConfig = {
  panelClass: 'dialog',
  hasBackdrop: true,
  maxWidth: '80vw',
  maxHeight: '90vh',
  width: '700px'
};

export const DATE_FORMATS: OwlDateTimeFormats = {
  parseInput:
    /^\s*(\d{1,2})\.(\d{1,2})\.(\d{2}|\d{4})(?:\,?\s+(\d{1,2})(?:\:(\d{2})?)?)?\s*$/,
  fullPickerInput: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric'
  },
  datePickerInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
  timePickerInput: { hour: 'numeric', minute: 'numeric' },
  monthYearLabel: { year: 'numeric', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: '2-digit' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    { provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    { provide: DEFAULT_DIALOG_CONFIG, useValue: DIALOG_CONFIG },
    { provide: NgSelectConfig, useClass: SelectConfig },
    { provide: DateTimeAdapter, useClass: JdavDateTimeAdapter },
    { provide: OWL_DATE_TIME_FORMATS, useValue: DATE_FORMATS }
  ]
};
