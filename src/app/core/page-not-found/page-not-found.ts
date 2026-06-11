import { Button } from '@/app/shared/ui/button';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [Button, RouterLink],
  templateUrl: './page-not-found.html',
})
export class PageNotFound {}
