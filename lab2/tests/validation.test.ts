import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation.required', () => {
  it('повертає invalid для порожнього рядка', () => {
    const result = Validation.required('');
    expect(result.valid).to.equal(false);
  });

  it('повертає invalid для рядка з самих пробілів', () => {
    const result = Validation.required('   ');
    expect(result.valid).to.equal(false);
  });

  it('повертає valid для непорожнього значення', () => {
    const result = Validation.required('Kobzar');
    expect(result.valid).to.equal(true);
  });
});

describe('Validation.isYear', () => {
  it('приймає коректний рік у 4 цифри', () => {
    expect(Validation.isYear('2004').valid).to.equal(true);
  });

  it('відхиляє нечисловий рік', () => {
    expect(Validation.isYear('abcd').valid).to.equal(false);
  });

  it('відхиляє рік поза допустимим діапазоном', () => {
    expect(Validation.isYear('99').valid).to.equal(false);
  });

  it('відхиляє порожнє значення', () => {
    expect(Validation.isYear('').valid).to.equal(false);
  });
});

describe('Validation.isNumericId', () => {
  it('приймає рядок лише з цифр', () => {
    expect(Validation.isNumericId('1725533394038').valid).to.equal(true);
  });

  it('відхиляє id з літерами', () => {
    expect(Validation.isNumericId('12a34').valid).to.equal(false);
  });
});

describe('Validation.isEmail', () => {
  it('приймає коректний email', () => {
    expect(Validation.isEmail('test@example.com').valid).to.equal(true);
  });

  it('відхиляє email без @', () => {
    expect(Validation.isEmail('test.example.com').valid).to.equal(false);
  });
});
