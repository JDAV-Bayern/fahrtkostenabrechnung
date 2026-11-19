import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form } from '@angular/forms/signals';
import { markFilledAsTouched, mergeDefaults } from './form-restore';

describe('mergeDefaults', () => {
  const defaults = () => ({
    name: '',
    count: 0,
    time: { start: null as Date | null, end: null as Date | null },
    list: [] as number[],
  });

  it('should return the defaults without stored data', () => {
    expect(mergeDefaults(defaults(), undefined)).toEqual(defaults());
  });

  it('should take over stored values', () => {
    const start = new Date(2025, 0, 1);
    expect(
      mergeDefaults(defaults(), {
        name: 'Max',
        count: 3,
        time: { start, end: null },
        list: [1, 2],
      }),
    ).toEqual({
      name: 'Max',
      count: 3,
      time: { start, end: null },
      list: [1, 2],
    });
  });

  it('should keep the defaults of fields that were not stored', () => {
    expect(mergeDefaults(defaults(), { name: 'Max', time: {} })).toEqual({
      ...defaults(),
      name: 'Max',
    });
  });

  it('should ignore stored fields that are unknown to the defaults', () => {
    const result = mergeDefaults(defaults(), {
      name: 'Max',
      files: [{}],
      time: { start: null, end: null, zone: 'UTC' },
    });
    expect(result).toEqual({ ...defaults(), name: 'Max' });
    expect('files' in result).toBe(false);
    expect('zone' in result.time).toBe(false);
  });

  it('should keep null values', () => {
    expect(mergeDefaults({ id: 5 as number | null }, { id: null })).toEqual({
      id: null,
    });
  });

  it('should keep the defaults if the stored section is not an object', () => {
    expect(mergeDefaults(defaults(), { time: 'invalid' }).time).toEqual({
      start: null,
      end: null,
    });
  });

  it('should not modify the defaults', () => {
    const base = defaults();
    mergeDefaults(base, { name: 'Max', time: { start: new Date() } });
    expect(base).toEqual(defaults());
  });
});

describe('markFilledAsTouched', () => {
  const create = () =>
    TestBed.runInInjectionContext(() => {
      const model = signal({
        name: 'Max',
        empty: '',
        flag: false,
        time: {
          start: new Date(2025, 0, 1) as Date | null,
          end: null as Date | null,
        },
        list: [{ label: 'a', note: '' }],
      });
      return { model, f: form(model) };
    });

  it('should mark fields with values as touched', () => {
    const { model, f } = create();
    markFilledAsTouched(f, model());

    expect(f.name().touched()).toBe(true);
    expect(f.time.start().touched()).toBe(true);
    expect(f.list[0].label().touched()).toBe(true);
  });

  it('should leave empty fields untouched', () => {
    const { model, f } = create();
    markFilledAsTouched(f, model());

    expect(f.empty().touched()).toBe(false);
    expect(f.flag().touched()).toBe(false);
    expect(f.time.end().touched()).toBe(false);
    expect(f.list[0].note().touched()).toBe(false);
  });
});
