import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from 'src/app/core/course.service';
import { ReimbursementControlService } from 'src/app/reimbursement/shared/reimbursement-control.service';
import { FormCardComponent } from 'src/app/shared/form-card/form-card.component';
import { Course } from 'src/domain/meeting.model';

@Component({
  selector: 'app-meeting-course-step',
  templateUrl: './meeting-course-step.component.html',
  styleUrls: ['./meeting-course-step.component.css'],
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule, FormCardComponent]
})
export class MeetingCourseStepComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly controlService = inject(ReimbursementControlService);

  form = this.controlService.meetingStep;
  courses$: Observable<Course[]> = this.courseService.getCourses();
  selected$: Observable<Course> | null = null;

  ngOnInit() {
    this.form.controls.type.setValue('course');

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
