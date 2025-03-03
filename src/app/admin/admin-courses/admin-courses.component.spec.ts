import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoursesComponent } from './admin-courses.component';

describe('AdminCoursesComponent', () => {
  let component: AdminCoursesComponent;
  let fixture: ComponentFixture<AdminCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
