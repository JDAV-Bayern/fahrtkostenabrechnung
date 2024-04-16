import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeIntl
} from '@danielmoncada/angular-datetime-picker';
import { DefaultIntl } from './datetime-intl';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    { provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' },
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
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' },
    { provide: OwlDateTimeIntl, useClass: DefaultIntl }
  ]
};
