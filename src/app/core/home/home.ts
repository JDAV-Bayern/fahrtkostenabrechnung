import { AuthService } from '@/app/auth/auth-service';
import { Badge } from '@/app/shared/ui/badge';
import { Button } from '@/app/shared/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/shared/ui/card';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
