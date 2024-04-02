import { AbstractControl, ValidationErrors } from '@angular/forms';

const COURSE_CODE_BY = /^B[0-9]{3}(FB|AM|GA)$/;
const COURSE_CODE_DE = /^J[0-9]{3}$/;
const COURSE_CODE_LJL = /^LJL$/

export function validateCourseCode(
  control: AbstractControl
): ValidationErrors | null {
  const v = control.value;
  if (v === null || v.length === 0 || v.match(COURSE_CODE_BY)) {
    return null;
  }
  if (v.match(COURSE_CODE_LJL)) {
    return null;
  }
  if (v.match(COURSE_CODE_DE)) {
    return { federalCourse: true };
  }
  return { unknownCourse: true };
}
