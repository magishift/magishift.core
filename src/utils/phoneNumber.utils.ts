export const defaultCountryCode = '+62';

export const PutCountryCode = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '');

  if (digits[0] === '0') {
    return defaultCountryCode + digits.slice(1);
  } else if (digits[0] === '8') {
    return defaultCountryCode + digits;
  } else {
    return '+' + digits;
  }
};
