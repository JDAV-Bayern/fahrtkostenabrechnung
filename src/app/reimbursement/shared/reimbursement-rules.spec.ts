import { addDays, subDays } from 'date-fns';
import { TransportMode } from 'src/domain/expense.model';
import {
  courseCodeError,
  exceedsModeLimit,
  firstDisallowedMode,
  isBicRequired,
  isFutureDateRange,
  isInvalidIban,
  isUnorderedDateRange,
} from './reimbursement-rules';

const DE_IBAN = 'DE02120300000000202051';
const CH_IBAN = 'CH9300762011623852957';

describe('courseCodeError', () => {
  it.each(['B123FB', 'B456AM', 'B789GA', 'B1234FB', 'B5678AM', 'B9012GA'])(
    'should accept the Bavarian course code %s',
    (code) => {
      expect(courseCodeError(code)).toBeNull();
    },
  );

  it.each(['LJV', 'VERANSTALTUNG'])(
    'should accept %s as special code',
    (code) => {
      expect(courseCodeError(code)).toBeNull();
    },
  );

  it('should accept empty values', () => {
    expect(courseCodeError('')).toBeNull();
    expect(courseCodeError(null)).toBeNull();
    expect(courseCodeError(undefined)).toBeNull();
  });

  it('should return federalCourse for DE course codes', () => {
    expect(courseCodeError('J123')).toBe('federalCourse');
  });

  it.each(['B12FB', 'B12345FB', 'B123XX', 'X123FB'])(
    'should return unknownCourse for %s',
    (code) => {
      expect(courseCodeError(code)).toBe('unknownCourse');
    },
  );
});

describe('isFutureDateRange', () => {
  const past = subDays(new Date(), 2);
  const future = addDays(new Date(), 2);

  it('should accept dates in the past', () => {
    expect(isFutureDateRange(subDays(past, 1), past)).toBe(false);
  });

  it('should reject a start date in the future', () => {
    expect(isFutureDateRange(future, null)).toBe(true);
  });

  it('should reject an end date in the future', () => {
    expect(isFutureDateRange(past, future)).toBe(true);
  });

  it('should accept empty values', () => {
    expect(isFutureDateRange(null, null)).toBe(false);
  });

  it('should ignore values that are not dates', () => {
    expect(isFutureDateRange('2999-01-01', undefined)).toBe(false);
  });
});

describe('isUnorderedDateRange', () => {
  const start = new Date(2025, 0, 1);
  const end = new Date(2025, 0, 3);

  it('should accept an end date after the start date', () => {
    expect(isUnorderedDateRange(start, end)).toBe(false);
  });

  it('should accept identical dates', () => {
    expect(isUnorderedDateRange(start, new Date(start))).toBe(false);
  });

  it('should reject an end date before the start date', () => {
    expect(isUnorderedDateRange(end, start)).toBe(true);
  });

  it('should accept ranges with a missing date', () => {
    expect(isUnorderedDateRange(start, null)).toBe(false);
    expect(isUnorderedDateRange(null, end)).toBe(false);
    expect(isUnorderedDateRange(null, null)).toBe(false);
  });
});

describe('transport mode rules', () => {
  const expenses = (...modes: TransportMode[]) =>
    modes.map((mode) => ({ mode }));

  describe('firstDisallowedMode', () => {
    const allowed: TransportMode[] = ['car', 'public'];

    it('should accept an empty list', () => {
      expect(firstDisallowedMode(expenses(), allowed)).toBeUndefined();
    });

    it('should accept only allowed modes', () => {
      expect(
        firstDisallowedMode(expenses('car', 'public', 'car'), allowed),
      ).toBeUndefined();
    });

    it('should return the first mode that is not allowed', () => {
      expect(
        firstDisallowedMode(expenses('car', 'bike', 'plan'), allowed),
      ).toBe('bike');
    });
  });

  describe('exceedsModeLimit', () => {
    it('should accept an empty list', () => {
      expect(exceedsModeLimit(expenses(), 'plan', 1)).toBe(false);
    });

    it('should accept as many limited expenses as allowed', () => {
      expect(exceedsModeLimit(expenses('plan'), 'plan', 1)).toBe(false);
      expect(
        exceedsModeLimit(expenses('car', 'plan', 'public'), 'plan', 1),
      ).toBe(false);
    });

    it('should not limit other modes', () => {
      expect(exceedsModeLimit(expenses('car', 'car', 'car'), 'plan', 1)).toBe(
        false,
      );
    });

    it('should detect an exceeded limit', () => {
      expect(exceedsModeLimit(expenses('plan', 'car', 'plan'), 'plan', 1)).toBe(
        true,
      );
    });
  });
});

describe('IBAN rules', () => {
  it('should accept valid IBANs', () => {
    expect(isInvalidIban(DE_IBAN)).toBe(false);
    expect(isInvalidIban(CH_IBAN)).toBe(false);
  });

  it('should accept IBANs with spaces', () => {
    expect(isInvalidIban('DE02 1203 0000 0000 2020 51')).toBe(false);
  });

  it('should reject invalid IBANs', () => {
    expect(isInvalidIban('DE00')).toBe(true);
    expect(isInvalidIban('XX123')).toBe(true);
  });

  it('should ignore empty IBANs', () => {
    expect(isInvalidIban('')).toBe(false);
  });

  describe('isBicRequired', () => {
    it('should not be required without an IBAN', () => {
      expect(isBicRequired('')).toBe(false);
    });

    it('should not be required for SEPA IBANs', () => {
      expect(isBicRequired(DE_IBAN)).toBe(false);
    });

    it('should not be required for invalid IBANs', () => {
      expect(isBicRequired('XX123')).toBe(false);
    });

    it.each([
      ['Switzerland', CH_IBAN],
      ['Monaco', 'MC5811222000010123456789030'],
      ['San Marino', 'SM86U0322509800000000270100'],
      ['Saudi Arabia', 'SA0380000000608010167519'],
    ])('should be required for %s', (_, iban) => {
      expect(isBicRequired(iban)).toBe(true);
    });
  });
});
