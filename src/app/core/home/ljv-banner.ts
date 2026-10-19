/*
 * TEMPORARY: Banner for the Landesjugendversammlung (LJV) 2026.
 *
 * Links directly to the course reimbursement form with the LJV prefilled.
 * It hides itself automatically after the end of November 2026.
 *
 * To remove: delete this file and the `<jdav-ljv-banner />` usage and import
 * in `home.html` / `home.ts` (both marked with "LJV banner").
 */
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'src/app/shared/ui/button';

/** First moment the banner is no longer shown (1 Dec 2026, 00:00 local time). */
const LJV_BANNER_HIDDEN_FROM = new Date(2026, 11, 1);

@Component({
  selector: 'jdav-ljv-banner',
  imports: [Button, RouterLink],
  template: `
    @if (visible) {
      <section
        class="bg-primary/10 border-y border-primary/30"
        aria-labelledby="ljv-banner-title"
      >
        <div
          class="container lg:max-w-screen-lg mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
        >
          <span
            class="material-symbols-outlined text-primary text-4xl! hidden md:block"
            aria-hidden="true"
          >
            groups
          </span>
          <div class="flex-1">
            <h2 id="ljv-banner-title" class="text-xl font-semibold">
              Mit ÖPNV oder in der Fahrgemeinschaft bei der LJV gewesen?
            </h2>
            <p class="mt-1 text-gray-700">
              Hier geht's direkt zur Fahrtkostenabrechnung für die
              Landesjugendversammlung
            </p>
          </div>
          <a
            jdavButton
            routerLink="/fahrtkosten/kurs"
            [queryParams]="queryParams"
            class="w-full md:w-auto h-11! px-6! text-base!"
          >
            Direkt zur Abrechnung für die LJV
            <span class="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </a>
        </div>
      </section>
    }
  `,
})
export class LjvBanner {
  protected readonly visible = new Date() < LJV_BANNER_HIDDEN_FROM;
  protected readonly queryParams = {
    nummer: 'LJV',
    name: 'Landesjugendversammlung',
  };
}
