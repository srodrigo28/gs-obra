import { onlyDigits } from '@/utils/formatters';

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);

  if (cnpj.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  let length = 12;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(length - i)) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== Number(digits.charAt(0))) {
    return false;
  }

  length = 13;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(length - i)) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === Number(digits.charAt(1));
}
