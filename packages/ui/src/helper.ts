import Vue from 'vue';

Vue.directive('back', event => {
  event.onclick = () => window.history.go(-1);
});

const storage = window.localStorage;

interface ILs {
  set: (key: string, value: any) => object;
  get: <T extends string | object>(key: string, defaultValue?: T) => T | null;
}

export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * localStorage
 */
const ls: ILs = {
  set(key: string, value: object): object {
    const storedVal = JSON.stringify(value);
    storage.setItem(key, storedVal);
    return value;
  },
  get: <T extends string | object>(key: string, defaultValue?: T): T | null => {
    const value: string | null = storage.getItem(key);

    return !value ? defaultValue : isJson(value) ? JSON.parse(value) : value;
  },
};

export interface IHelper {
  store: (key: string, value?: object) => object | null;
  ls: ILs;
  moneyFormatter: (value: string) => string;
}

export const helper: IHelper = {
  /**
   * localStorage
   */
  ls,

  /**
   * a wrapper for helper.ls
   */
  store: (key: string, value?: object): object | null => {
    if (!value) {
      return ls.get(key);
    }

    return ls.set(key, value);
  },

  moneyFormatter: (value: string): string => {
    return value
      ? value
          .toString()
          .replace(/[^0-9.,]/g, '')
          .replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
      : '0';
  },
};
