import { Component, inject } from '@angular/core';
import { ErrorService } from './error.service';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  private readonly errorService: ErrorService = inject(ErrorService);

  error = this.errorService.getError();
}
