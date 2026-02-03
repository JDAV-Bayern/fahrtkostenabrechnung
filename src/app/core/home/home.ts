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
