import { Injectable } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Injectable({ providedIn: 'root' })
export class JdavDatepickerIntl extends MatDatepickerIntl {
  /** A label for the calendar popup (used by screen readers). */
  override calendarLabel = 'Kalender';

  /** A label for the button used to open the calendar popup (used by screen readers). */
  override openCalendarLabel = 'Kalender öffnen';

  /** Label for the button used to close the calendar popup. */
  override closeCalendarLabel = 'Kalender schließen';

  /** A label for the previous month button (used by screen readers). */
  override prevMonthLabel = 'Vorheriger Monat';

  /** A label for the next month button (used by screen readers). */
  override nextMonthLabel = 'Nächster Monat';

  /** A label for the previous year button (used by screen readers). */
  override prevYearLabel = 'Vorheriges Jahr';

  /** A label for the next year button (used by screen readers). */
  override nextYearLabel = 'Nächstes Jahr';

  /** A label for the previous multi-year button (used by screen readers). */
  override prevMultiYearLabel = 'Vorherige 24 Jahre';

  /** A label for the next multi-year button (used by screen readers). */
  override nextMultiYearLabel = 'Nächste 24 Jahre';

  /** A label for the 'switch to month view' button (used by screen readers). */
  override switchToMonthViewLabel = 'Datum auswählen';

  /** A label for the 'switch to year view' button (used by screen readers). */
  override switchToMultiYearViewLabel = 'Monat und Jahr auswählen';

  /** A label for the first date of a range of dates (used by screen readers). */
  override startDateLabel = 'Startdatum';

  /** A label for the last date of a range of dates (used by screen readers). */
  override endDateLabel = 'Enddatum';

  /** Formats a label for a range of years (used by screen readers). */
  override formatYearRangeLabel(start: string, end: string): string {
    return `${start} bis ${end}`;
  }
}
