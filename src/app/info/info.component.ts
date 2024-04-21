import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  standalone: true,
  imports: [RouterOutlet, BreadcrumbsComponent]
})
export class InfoComponent {}
