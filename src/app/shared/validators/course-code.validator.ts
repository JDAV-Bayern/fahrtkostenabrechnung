import { ValidatorFn } from '@angular/forms';

const COURSE_CODE_BY = /^B[0-9]{3,4}(FB|AM|GA)$/;
const COURSE_CODE_DE = /^J[0-9]{3}$/;

export const validateCourseCode: ValidatorFn = (control) => {
  const v = control.value;
  if (v === null || v.length === 0 || v === 'LJV' || v.match(COURSE_CODE_BY)) {
    return null;
  }
  if (v.match(COURSE_CODE_DE)) {
    return { federalCourse: true };
  }
  return { unknownCourse: true };
};
