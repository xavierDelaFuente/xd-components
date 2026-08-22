import type { ValidationRules } from '@asnewyla/input';

export function validateValue(
  value: string,
  rules?: ValidationRules,
): string | undefined {
  if (!rules) return undefined;

  if (rules.required && value.trim() === '') {
    return typeof rules.required === 'string'
      ? rules.required
      : 'This field is required';
  }
  if (rules.pattern && value !== '' && !new RegExp(rules.pattern).test(value)) {
    return 'Invalid format';
  }
  if (rules.minLength !== undefined && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  if (rules.maxLength !== undefined && value.length > rules.maxLength) {
    return `Must be at most ${rules.maxLength} characters`;
  }
  if (
    rules.min !== undefined &&
    value !== '' &&
    Number(value) < Number(rules.min)
  ) {
    return `Must be at least ${rules.min}`;
  }
  if (
    rules.max !== undefined &&
    value !== '' &&
    Number(value) > Number(rules.max)
  ) {
    return `Must be at most ${rules.max}`;
  }
  if (rules.validate) {
    return rules.validate(value);
  }
  return undefined;
}
