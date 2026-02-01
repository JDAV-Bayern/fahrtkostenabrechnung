import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { filter } from 'rxjs';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Button } from 'src/app/shared/ui/button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'header[jdav-header]',
  templateUrl: './header.component.html',
  imports: [Button, RouterLink],
  host: {
    class: 'z-1 shadow-md',
  },
})
export class HeaderComponent implements OnInit {
  private readonly controlService = inject(ReimbursementControlService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  title = signal('Portal');
  hideRemoveDataButton = signal(true);

  ngOnInit() {
    this.updateHeaderData();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderData();
      });
  }

  private updateHeaderData() {
    this.title.set('Portal');
    this.hideRemoveDataButton.set(true);

    let route = this.route;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data;
    const title = route.snapshot.title;
    if (title) {
      this.title.set(title);
    }
    if (data['showDeleteDataButton']) {
      this.hideRemoveDataButton.set(!data['showDeleteDataButton']);
    }
  }

  deleteAllData() {
    const control = this.controlService.meetingStep.controls.type;
    const meetingType = control.value;

    const originUrl =
      meetingType === 'committee' ? 'fahrtkosten-gremium' : 'fahrtkosten';

    this.controlService.deleteStoredData();
    control.setValue(meetingType);
    this.router.navigate([originUrl]);
  }
}
