import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
export class Home {}
