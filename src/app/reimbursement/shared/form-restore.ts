import { FieldTree } from '@angular/forms/signals';

type PlainObject = Record<string, unknown>;

const isPlainObject = (value: unknown): value is PlainObject =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date);

/**
 * Overlays stored data onto the defaults.
 *
 * Stored data may lack fields (e.g. fields of other meeting types were never
 * stored by older versions) and may contain fields that no longer exist: the
 * result has exactly the shape of the defaults. Arrays and primitive values are
 * taken over as they are.
 */
export function mergeDefaults<T>(defaults: T, stored: unknown): T {
  if (stored === undefined) {
    return defaults;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(stored)) {
      return defaults;
    }

    const result: PlainObject = {};
    for (const [key, value] of Object.entries(defaults)) {
      result[key] = mergeDefaults(value, stored[key]);
    }
    return result as T;
  }

  return stored as T;
}

/**
 * Marks every field that holds a value as touched, so that its validation
 * errors are shown right away (e.g. for restored drafts).
 */
export function markFilledAsTouched(
  field: FieldTree<unknown>,
  value: unknown,
): void {
  if (Array.isArray(value) || isPlainObject(value)) {
    const children = field as unknown as Record<string, FieldTree<unknown>>;
    for (const [key, child] of Object.entries(value)) {
      markFilledAsTouched(children[key], child);
    }
  } else if (value) {
    field().markAsTouched();
  }
}
