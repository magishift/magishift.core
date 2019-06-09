import { config } from '@/config';
import { helper } from '@/helper';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

const locales = ['en-US'];

Vue.use(VueI18n);

interface IMessageObject {
  [key: string]: IMessageObject;
}

const messages: { [key: string]: IMessageObject } = {};

locales.forEach(v => {
  messages[v] = require(`./${v}/index`).default;
});

export const i18n = new VueI18n({
  locale: helper.ls.get('locale', config.locale) as string,
  silentTranslationWarn: true,
  messages,
});
