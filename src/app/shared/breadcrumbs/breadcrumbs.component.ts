import { Component, inject, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
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
  imports: [RouterLink],
})
export class BreadcrumbsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  breadcrumbs: Breadcrumb[] = [];

  ngOnInit() {
    this.buildBreadcrumb(this.route);

    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = [];
        this.buildBreadcrumb(this.route);
      });
  }

  buildBreadcrumb(route: ActivatedRoute): void {
    if (route.snapshot.data['breadcrumb']) {
      // get the full path to the current activated route
      const breadcrumbLink = route.pathFromRoot
        .map((route) => route.snapshot.url)
        .flat()
        .join('/');

      // create a breadcrumb from route data and the link
      this.breadcrumbs.push({
        label: route.snapshot.data['breadcrumb'],
        link: breadcrumbLink,
      });
    }

    if (route.firstChild !== null) {
      // handle children recursively
      this.buildBreadcrumb(route.firstChild);
    }
  }
}
