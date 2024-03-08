import { Component } from '@angular/core';
import { ReimbursementControlService } from 'src/app/reimbursement-control.service';

@Component({
  selector: 'app-course-data',
  templateUrl: './course-data.component.html',
  styleUrls: ['./course-data.component.css']
})
export class CourseDataComponent {
  form;

  constructor(public controlService: ReimbursementControlService) {
    this.form = controlService.courseStep;
  }

  get code() {
    return this.form.controls.code;
  }

  get name() {
    return this.form.controls.name;
  }
}
