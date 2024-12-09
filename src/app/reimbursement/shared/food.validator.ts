import { FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import {
  Interval,
  closestIndexTo,
  differenceInHours,
  eachDayOfInterval,
  startOfDay
} from 'date-fns';
import { Absence } from 'src/domain/expense.model';
import { toInterval } from '../../shared/validators/date-range.validator';

export interface FoodOptions {
  date: Date;
  absence: Absence | null;
  options?: Absence[];
}

export function getFoodOptions(interval: Interval) {
  // too short
  if (!interval || differenceInHours(interval.end, interval.start) < 8) {
    return [];
  }

  // add all days
  const foodOpts: FoodOptions[] = eachDayOfInterval(interval).map(date => ({
    date,
    absence: 'fullDay'
  }));

  if (foodOpts.length === 1) {
    // single day
    foodOpts[0].absence = 'workDay';
  } else if (foodOpts.length === 2) {
    // two days
    // find longer day
    const midnight = startOfDay(interval.end);
    const short = closestIndexTo(midnight, [interval.start, interval.end]) || 0;
    const long = short === 0 ? 1 : 0;

    // set available options
    foodOpts[short].options = ['travelDay'];
    foodOpts[long].options = ['workDay', 'travelDay'];

    // set default option based on trip length
    if (differenceInHours(interval.end, interval.start) < 16) {
      foodOpts[short].absence = null;
      foodOpts[long].absence = 'workDay';
    } else {
      foodOpts[short].absence = 'travelDay';
      foodOpts[long].absence = 'travelDay';
    }
  } else {
    // multiple days
    foodOpts[0].absence = 'travelDay';
    foodOpts[foodOpts.length - 1].absence = 'travelDay';
  }

  return foodOpts;
}

export const validateFoodExpenseUnique: ValidatorFn = control => {
  if (control instanceof FormArray) {
    const dates = control.controls
      .map(control => control.get('date')?.value)
      .filter(date => date instanceof Date)
      .sort();

    for (let i = 1; i < dates.length; i++) {
      if (+dates[i - 1] === +dates[i]) {
        return { foodExpensesUnique: { date: dates[i] } };
      }
    }
  }
  return null;
};

export const validateFoodExpenseWorkDay: ValidatorFn = control => {
  if (control instanceof FormArray && control.length > 1) {
    const workDay = control.controls.find(control => {
      const absence = control.get('absence');
      return absence && absence.value === 'workDay';
    });
    return workDay ? { foodExpenseWorkDay: true } : null;
  }
  return null;
};

export const validateFoodExpenseInterval: ValidatorFn = control => {
  const time = control.get('meeting.time');
  const food = control.get('expenses.food');
  if (!(time instanceof FormGroup) || !(food instanceof FormArray)) {
    return null;
  }

  const i = toInterval(time);
  if (!i) {
    return null;
  }

  const foodOpts = getFoodOptions(i);

  for (const item of food.controls) {
    const date = item.get('date');
    const absence = item.get('absence');

    if (!date || !absence || !(date.value instanceof Date)) {
      continue;
    }

    const foodOpt = foodOpts.find(opt => +opt.date === +date.value);

    if (!foodOpt) {
      return { foodExpenseDate: { date: date.value } };
    }

    if (
      foodOpt.absence !== absence.value &&
      !foodOpt.options?.includes(absence.value)
    ) {
      return { foodExpenseAbsence: { date: date.value } };
    }
  }

  return null;
};
