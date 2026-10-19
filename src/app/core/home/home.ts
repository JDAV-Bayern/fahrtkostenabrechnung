import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service';
import { Badge } from 'src/app/shared/ui/badge';
import { Button } from 'src/app/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/app/shared/ui/card';
// LJV banner (temporary, remove after November 2026 – see ljv-banner.ts)
import { LjvBanner } from './ljv-banner';

@Component({
  selector: 'jdav-home',
  imports: [
    Badge,
    Button,
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    LjvBanner, // LJV banner (temporary)
    RouterLink,
  ],
  templateUrl: './home.html',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['meine-kurse']);
      }
    });
  }
}
