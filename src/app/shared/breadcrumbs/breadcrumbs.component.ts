import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink
} from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  link: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, RouterLink]
})
export class BreadcrumbsComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = [];
        this.buildBreadcrumb(this.route);
      });
  }

  buildBreadcrumb(route: ActivatedRoute): void {
    if (route.snapshot.data['breadcrumb']) {
      // get the full path to the current activated route
      const breadcrumbLink = route.pathFromRoot
        .map(route => route.snapshot.url)
        .flat()
        .join('/');

      // create a breadcrumb from route data and the link
      this.breadcrumbs.push({
        label: route.snapshot.data['breadcrumb'],
        link: breadcrumbLink
      });
    }

    if (route.firstChild !== null) {
      // handle children recursively
      this.buildBreadcrumb(route.firstChild);
    }
  }
}
