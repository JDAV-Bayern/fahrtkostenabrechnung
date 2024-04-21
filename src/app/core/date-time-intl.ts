import { Injectable } from '@angular/core';
import { OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';

@Injectable({ providedIn: 'root' })
export class DateTimeIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  override upSecondLabel = 'Plus eine Sekunde';

  /** A label for the down second button (used by screen readers).  */
  override downSecondLabel = 'Minus eine Sekunde';

  /** A label for the up minute button (used by screen readers).  */
  override upMinuteLabel = 'Plus eine Minute';

  /** A label for the down minute button (used by screen readers).  */
  override downMinuteLabel = 'Minus eine Minute';

  /** A label for the up hour button (used by screen readers).  */
  override upHourLabel = 'Plus eine Stunde';

  /** A label for the down hour button (used by screen readers).  */
  override downHourLabel = 'Minus eine Stunde';

  /** A label for the previous month button (used by screen readers). */
  override prevMonthLabel = 'Vorheriger Monat';

  /** A label for the next month button (used by screen readers). */
  override nextMonthLabel = 'Nächster Monat';

  /** A label for the previous year button (used by screen readers). */
  override prevYearLabel = 'Vorheriges Jahr';

  /** A label for the next year button (used by screen readers). */
  override nextYearLabel = 'Nächstes Jahr';

  /** A label for the previous multi-year button (used by screen readers). */
  override prevMultiYearLabel = 'Vorherige 21 Jahre';

  /** A label for the next multi-year button (used by screen readers). */
  override nextMultiYearLabel = 'Nächste 21 Jahre';

  /** A label for the 'switch to month view' button (used by screen readers). */
  override switchToMonthViewLabel = 'Zu Monatsansicht wechseln';

  /** A label for the 'switch to year view' button (used by screen readers). */
  override switchToMultiYearViewLabel = 'Zu Jahresansicht wechseln';

  /** A label for the cancel button */
  override cancelBtnLabel = 'Abbrechen';

  /** A label for the set button */
  override setBtnLabel = 'Setzen';

  /** A label for the range 'from' in picker info */
  override rangeFromLabel = 'Von';

  /** A label for the range 'to' in picker info */
  override rangeToLabel = 'Bis';
}
