import { FormControl } from '@angular/forms';
import { validateCourseCode } from './course-code.validator';

describe('validateCourseCode', () => {
  it('should accept valid 3-digit BY course codes', () => {
    expect(validateCourseCode(new FormControl('B123FB'))).toBeNull();
    expect(validateCourseCode(new FormControl('B456AM'))).toBeNull();
    expect(validateCourseCode(new FormControl('B789GA'))).toBeNull();
  });

  it('should accept valid 4-digit BY course codes', () => {
    expect(validateCourseCode(new FormControl('B1234FB'))).toBeNull();
    expect(validateCourseCode(new FormControl('B5678AM'))).toBeNull();
    expect(validateCourseCode(new FormControl('B9012GA'))).toBeNull();
  });

  it('should accept LJV as special code', () => {
    expect(validateCourseCode(new FormControl('LJV'))).toBeNull();
  });

  it('should accept empty values', () => {
    expect(validateCourseCode(new FormControl(''))).toBeNull();
    expect(validateCourseCode(new FormControl(null))).toBeNull();
  });

  it('should return federalCourse error for DE course codes', () => {
    expect(validateCourseCode(new FormControl('J123'))).toEqual({
      federalCourse: true,
    });
  });

  it('should return unknownCourse error for invalid codes', () => {
    expect(validateCourseCode(new FormControl('B12FB'))).toEqual({
      unknownCourse: true,
    });
    expect(validateCourseCode(new FormControl('B12345FB'))).toEqual({
      unknownCourse: true,
    });
    expect(validateCourseCode(new FormControl('B123XX'))).toEqual({
      unknownCourse: true,
    });
    expect(validateCourseCode(new FormControl('X123FB'))).toEqual({
      unknownCourse: true,
    });
  });
});
