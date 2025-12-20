import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'src/app/shared/ui/button';

@Component({
  selector: 'app-page-not-found',
  imports: [Button, RouterLink],
  templateUrl: './page-not-found.html',
})
export class PageNotFound {}
