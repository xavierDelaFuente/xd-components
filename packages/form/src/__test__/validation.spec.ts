import { describe, expect, it } from 'vitest';
import { validateValue } from '../components/validation';

describe('validateValue', () => {
  it('returns undefined when no rules are given', () => {
    expect(validateValue('anything')).toBeUndefined();
  });

  it('returns undefined when rules is an empty object', () => {
    expect(validateValue('anything', {})).toBeUndefined();
  });

  describe('required', () => {
    it.each`
      required               | value       | expected
      ${true}                | ${''}       | ${'This field is required'}
      ${true}                | ${'   '}    | ${'This field is required'}
      ${'Name is mandatory'} | ${''}       | ${'Name is mandatory'}
      ${true}                | ${'Jordan'} | ${undefined}
      ${false}               | ${''}       | ${undefined}
    `(
      'required=$required, value="$value" → $expected',
      ({ required, value, expected }) => {
        expect(validateValue(value, { required })).toBe(expected);
      },
    );
  });

  describe('pattern', () => {
    const pattern = '^\\S+@\\S+$';

    it.each`
      value             | expected
      ${'not-an-email'} | ${'Invalid format'}
      ${'a@b.com'}      | ${undefined}
      ${''}             | ${undefined}
    `('value="$value" → $expected', ({ value, expected }) => {
      expect(validateValue(value, { pattern })).toBe(expected);
    });
  });

  describe('minLength', () => {
    it.each`
      value       | expected
      ${'ab'}     | ${'Must be at least 5 characters'}
      ${'abcde'}  | ${undefined}
      ${'abcdef'} | ${undefined}
    `('value="$value" → $expected', ({ value, expected }) => {
      expect(validateValue(value, { minLength: 5 })).toBe(expected);
    });
  });

  describe('maxLength', () => {
    it.each`
      value       | expected
      ${'abcdef'} | ${'Must be at most 5 characters'}
      ${'abcde'}  | ${undefined}
      ${'ab'}     | ${undefined}
    `('value="$value" → $expected', ({ value, expected }) => {
      expect(validateValue(value, { maxLength: 5 })).toBe(expected);
    });
  });

  describe('min', () => {
    it.each`
      value   | min    | expected
      ${'3'}  | ${5}   | ${'Must be at least 5'}
      ${'5'}  | ${5}   | ${undefined}
      ${'10'} | ${5}   | ${undefined}
      ${''}   | ${5}   | ${undefined}
      ${'3'}  | ${'5'} | ${'Must be at least 5'}
    `('value="$value", min=$min → $expected', ({ value, min, expected }) => {
      expect(validateValue(value, { min })).toBe(expected);
    });
  });

  describe('max', () => {
    it.each`
      value   | max    | expected
      ${'10'} | ${5}   | ${'Must be at most 5'}
      ${'5'}  | ${5}   | ${undefined}
      ${'3'}  | ${5}   | ${undefined}
      ${''}   | ${5}   | ${undefined}
      ${'10'} | ${'5'} | ${'Must be at most 5'}
    `('value="$value", max=$max → $expected', ({ value, max, expected }) => {
      expect(validateValue(value, { max })).toBe(expected);
    });
  });

  describe('validate (custom sync validator)', () => {
    const validate = (value: string) =>
      value === 'admin' ? 'That username is reserved' : undefined;

    it.each`
      value       | expected
      ${'admin'}  | ${'That username is reserved'}
      ${'jordan'} | ${undefined}
    `('value="$value" → $expected', ({ value, expected }) => {
      expect(validateValue(value, { validate })).toBe(expected);
    });

    it('receives the raw current value being validated', () => {
      let received: string | undefined;
      validateValue('some-value', {
        validate: (value) => {
          received = value;
          return undefined;
        },
      });

      expect(received).toBe('some-value');
    });
  });

  describe('rule precedence — first failing rule wins, in required → pattern → minLength → maxLength → min → max → validate order', () => {
    it.each`
      description                   | value       | rules                                              | expected
      ${'required over pattern'}    | ${''}       | ${{ required: true, pattern: '^\\d+$' }}           | ${'This field is required'}
      ${'pattern over minLength'}   | ${'ab'}     | ${{ pattern: '^\\d+$', minLength: 10 }}            | ${'Invalid format'}
      ${'minLength over maxLength'} | ${'ab'}     | ${{ minLength: 5, maxLength: 1 }}                  | ${'Must be at least 5 characters'}
      ${'maxLength over min'}       | ${'abcdef'} | ${{ maxLength: 5, min: 100 }}                      | ${'Must be at most 5 characters'}
      ${'min over max'}             | ${'3'}      | ${{ min: 5, max: 1 }}                              | ${'Must be at least 5'}
      ${'max over validate'}        | ${'10'}     | ${{ max: 5, validate: () => 'validator message' }} | ${'Must be at most 5'}
    `('$description', ({ value, rules, expected }) => {
      expect(validateValue(value, rules)).toBe(expected);
    });

    it('validate only runs once every native rule has passed', () => {
      const validate = () => 'validator message';

      expect(
        validateValue('ok', {
          required: true,
          pattern: '^\\w+$',
          minLength: 1,
          maxLength: 10,
          validate,
        }),
      ).toBe('validator message');
    });
  });
});
