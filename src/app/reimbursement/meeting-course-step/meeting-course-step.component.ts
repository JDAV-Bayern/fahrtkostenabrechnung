import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { Observable } from 'rxjs';
import { Course } from 'src/domain/meeting.model';
import { CourseService } from 'src/app/core/course.service';

@Component({
  selector: 'app-meeting-course-step',
  templateUrl: './meeting-course-step.component.html',
  styleUrls: ['./meeting-course-step.component.css'],
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, FormCardComponent]
})
export class MeetingCourseStepComponent {
  form;
  courses$: Observable<Course[]>;
  selected$: Observable<Course> | null = null;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private controlService: ReimbursementControlService
  ) {
    this.form = this.controlService.meetingStep;
    this.form.controls.type.setValue('course');

    // load available courses
    this.courses$ = this.courseService.getCourses();

    // load selected course
    this.requestSelected(this.course.value);
    this.course.valueChanges.subscribe(value => this.requestSelected(value));

    this.route.queryParamMap.subscribe(params => {
      if (params.has('nummer')) {
        const number = params.get('nummer') || '';
        this.courses$.subscribe(courses => {
          const selected = courses.find(course => course.number === number);
          if (selected) {
            this.course.setValue(selected.id);
          }
        });
      }
    });
  }

  get course() {
    return this.form.controls.course;
  }

  private requestSelected(id: number | null) {
    this.selected$ = id ? this.courseService.getCourse(id) : null;
  }
}
