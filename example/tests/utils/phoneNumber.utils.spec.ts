import { PutCountryCode } from '../../../src/utils/phoneNumber.utils';

describe('PutCountryCode', () => {
  it('should return phone number with country code', async () => {
    const phone1 = '08123456';
    const phoneExpected1 = '+628123456';
    expect(PutCountryCode(phone1)).toBe(phoneExpected1);

    const phone2 = '+628123456';
    const phoneExpected2 = '+628123456';
    expect(PutCountryCode(phone2)).toBe(phoneExpected2);

    const phone3 = '8123456';
    const phoneExpected3 = '+628123456';
    expect(PutCountryCode(phone3)).toBe(phoneExpected3);
  });
});
