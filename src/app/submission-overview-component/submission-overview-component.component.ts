import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submission-overview-component',
  templateUrl: './submission-overview-component.component.html',
  styleUrls: ['./submission-overview-component.component.css']
})
export class SubmissionOverviewComponentComponent {

  constructor(private readonly router: Router) { }
  continue() {

  }
  back() {
    this.router.navigate(['auslagen']);
  }
}
