/**
 * Простір імен Validation - містить чисті функції валідації форм.
 * Групування у namespace доречне тут, бо це набір тісно пов'язаних
 * допоміжних функцій без стану, які використовуються лише всередині utils/ui.
 */
export namespace Validation {
  export interface ValidationResult {
    valid: boolean;
    message?: string;
  }

  const YEAR_REGEX = /^(1[0-9]{3}|20[0-9]{2})$/; // 1000-2099
  const NUMERIC_ID_REGEX = /^[0-9]+$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  export function required(value: string): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { valid: false, message: 'Це поле є обов\'язковим' };
    }
    return { valid: true };
  }

  export function isYear(value: string): ValidationResult {
    const req = required(value);
    if (!req.valid) return req;
    if (!YEAR_REGEX.test(value.trim())) {
      return { valid: false, message: 'Рік видання має бути коректним роком (напр. 2004)' };
    }
    return { valid: true };
  }

  export function isNumericId(value: string): ValidationResult {
    const req = required(value);
    if (!req.valid) return req;
    if (!NUMERIC_ID_REGEX.test(value.trim())) {
      return { valid: false, message: 'ID користувача повинен містити лише цифри' };
    }
    return { valid: true };
  }

  export function isEmail(value: string): ValidationResult {
    const req = required(value);
    if (!req.valid) return req;
    if (!EMAIL_REGEX.test(value.trim())) {
      return { valid: false, message: 'Введіть коректний email' };
    }
    return { valid: true };
  }
}
