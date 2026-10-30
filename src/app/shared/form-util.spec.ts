import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  deepMarkAsDirty,
  reviveFormArray,
  reviveFormArrays,
} from './form-util';

describe('reviveFormArray', () => {
  it('should create one control per value', () => {
    const array = new FormArray<FormControl>([]);
    reviveFormArray('items', array, [1, 2, 3], () => new FormControl());
    expect(array.length).toBe(3);
  });

  it('should replace existing controls', () => {
    const existing = new FormControl('old');
    const array = new FormArray([existing]);
    reviveFormArray('items', array, [1], () => new FormControl());
    expect(array.length).toBe(1);
    expect(array.at(0)).not.toBe(existing);
  });

  it('should pass the key to the factory', () => {
    const factory = vi.fn(() => new FormControl());
    reviveFormArray('items', new FormArray<FormControl>([]), [1, 2], factory);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledWith('items');
  });

  it('should skip values for which the factory returns nothing', () => {
    const array = new FormArray<FormControl>([]);
    reviveFormArray('items', array, [1, 2], () => undefined);
    expect(array.length).toBe(0);
  });

  it('should clear the array for an empty value', () => {
    const array = new FormArray([new FormControl(1)]);
    reviveFormArray('items', array, [], () => new FormControl());
    expect(array.length).toBe(0);
  });
});

describe('reviveFormArrays', () => {
  it('should do nothing without a value', () => {
    const array = new FormArray([new FormControl(1)]);
    const factory = vi.fn(() => new FormControl());
    reviveFormArrays(array, undefined, factory);
    reviveFormArrays(array, null, factory);
    expect(array.length).toBe(1);
    expect(factory).not.toHaveBeenCalled();
  });

  it('should revive arrays nested in groups', () => {
    const form = new FormGroup({
      name: new FormControl(''),
      items: new FormArray<FormControl>([]),
    });
    reviveFormArrays(
      form,
      { name: 'x', items: ['a', 'b'] },
      () => new FormControl(),
    );
    expect(form.controls.items.length).toBe(2);
  });

  it('should revive arrays in deeper levels', () => {
    const form = new FormGroup({
      outer: new FormGroup({
        items: new FormArray<FormControl>([]),
      }),
    });
    reviveFormArrays(
      form,
      { outer: { items: [1, 2, 3] } },
      () => new FormControl(),
    );
    expect(form.controls.outer.controls.items.length).toBe(3);
  });

  it('should revive arrays inside array elements', () => {
    const form = new FormGroup({
      rows: new FormArray<FormGroup<{ tags: FormArray<FormControl> }>>([]),
    });
    const factory = (key?: string) =>
      key === 'rows'
        ? new FormGroup({ tags: new FormArray<FormControl>([]) })
        : new FormControl();

    reviveFormArrays(
      form,
      { rows: [{ tags: ['a', 'b'] }, { tags: ['c'] }] },
      factory,
    );

    expect(form.controls.rows.length).toBe(2);
    expect(form.controls.rows.at(0).controls.tags.length).toBe(2);
    expect(form.controls.rows.at(1).controls.tags.length).toBe(1);
  });

  it('should leave arrays alone when the value is not an array', () => {
    const array = new FormArray([new FormControl(1)]);
    const form = new FormGroup({ items: array });
    reviveFormArrays(form, { items: 'nope' }, () => new FormControl());
    expect(array.length).toBe(1);
  });

  it('should leave arrays alone when the group has no value for them', () => {
    const array = new FormArray([new FormControl(1)]);
    const form = new FormGroup({ items: array });
    reviveFormArrays(form, {}, () => new FormControl());
    expect(array.length).toBe(1);
  });
});

describe('deepMarkAsDirty', () => {
  it('should mark controls with a value as dirty and touched', () => {
    const control = new FormControl('x');
    deepMarkAsDirty(control);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should leave controls without a value untouched', () => {
    const empty = new FormControl('');
    const nothing = new FormControl(null);
    const zero = new FormControl(0);
    deepMarkAsDirty(empty);
    deepMarkAsDirty(nothing);
    deepMarkAsDirty(zero);
    expect(empty.dirty).toBe(false);
    expect(nothing.dirty).toBe(false);
    expect(zero.dirty).toBe(false);
  });

  it('should descend into groups and arrays', () => {
    const filled = new FormControl('a');
    const empty = new FormControl('');
    const inArray = new FormControl('b');
    const form = new FormGroup({
      group: new FormGroup({ filled, empty }),
      list: new FormArray([inArray]),
    });

    deepMarkAsDirty(form);

    expect(filled.dirty).toBe(true);
    expect(inArray.dirty).toBe(true);
    expect(empty.dirty).toBe(false);
  });
});
