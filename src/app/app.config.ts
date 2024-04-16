import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl
} from '@danielmoncada/angular-datetime-picker';
import { DefaultIntl } from './datetime-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    { provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }
  ]
};
