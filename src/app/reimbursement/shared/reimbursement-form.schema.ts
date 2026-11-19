import {
  hidden,
  pattern,
  required,
  SchemaFn,
  validate,
} from '@angular/forms/signals';
import { ReimbursementFormModel } from './reimbursement-form.model';
import {
  BIC_PATTERN,
  courseCodeError,
  exceedsModeLimit,
  firstDisallowedMode,
  isBicRequired,
  isFutureDateRange,
  isInvalidIban,
  isUnorderedDateRange,
  PLZ_PATTERN,
} from './reimbursement-rules';

export interface ReimbursementSchemaOptions {
  /**
   * The reimbursement total. Read inside a rule, so the rule is evaluated again
   * whenever the signals behind it (expenses, expense config, ...) change.
   */
  total: () => number;
}

/**
 * Validation and availability rules of the reimbursement wizard.
 *
 * The error kinds are the keys the templates check for.
 */
export function reimbursementSchema(
  options: ReimbursementSchemaOptions,
): SchemaFn<ReimbursementFormModel> {
  return (p) => {
    const { meeting, participant, expenses } = p;

    // meeting
    required(meeting.name);

    hidden(meeting.code, {
      when: ({ valueOf }) => valueOf(meeting.type) !== 'course',
    });
    required(meeting.code);
    validate(meeting.code, ({ value }) => {
      const kind = courseCodeError(value());
      return kind ? { kind } : null;
    });

    hidden(meeting.location, {
      when: ({ valueOf }) => valueOf(meeting.type) !== 'committee',
    });
    required(meeting.location);

    hidden(meeting.time, {
      when: ({ valueOf }) => valueOf(meeting.type) !== 'committee',
    });
    required(meeting.time.start);
    required(meeting.time.end);
    validate(meeting.time, ({ value }) =>
      isUnorderedDateRange(value().start, value().end)
        ? { kind: 'dateRangeOrder' }
        : null,
    );
    validate(meeting.time, ({ value }) =>
      isFutureDateRange(value().start, value().end)
        ? { kind: 'dateRangePast' }
        : null,
    );

    // participant
    required(participant.givenName);
    required(participant.familyName);
    required(participant.sectionId);
    required(participant.zipCode);
    pattern(participant.zipCode, PLZ_PATTERN);
    required(participant.city);
    required(participant.iban);
    validate(participant.iban, ({ value }) =>
      isInvalidIban(value()) ? { kind: 'ibanInvalid' } : null,
    );

    hidden(participant.bic, {
      when: ({ valueOf }) => !isBicRequired(valueOf(participant.iban)),
    });
    required(participant.bic);
    pattern(participant.bic, BIC_PATTERN);

    // expenses
    const { inbound, onsite, outbound } = expenses.transport;
    for (const direction of [inbound, outbound]) {
      validate(direction, ({ value }) =>
        exceedsModeLimit(value(), 'plan', 1)
          ? { kind: 'transportModeLimited' }
          : null,
      );
    }
    validate(onsite, ({ value }) =>
      firstDisallowedMode(value(), ['car', 'public'])
        ? { kind: 'transportModesAllowed' }
        : null,
    );

    validate(expenses, () =>
      options.total() === 0 ? { kind: 'totalRequired' } : null,
    );
  };
}
