import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl
} from '@danielmoncada/angular-datetime-picker';
import { DateTimeIntl } from './core/date-time-intl';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SelectConfig } from './core/ng-select.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    { provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        panelClass: 'dialog',
        hasBackdrop: true,
        maxWidth: '80vw',
        maxHeight: '90vh',
        width: '700px'
      }
    },
    { provide: NgSelectConfig, useClass: SelectConfig },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' },
    { provide: OwlDateTimeIntl, useClass: DateTimeIntl }
  ]
};
