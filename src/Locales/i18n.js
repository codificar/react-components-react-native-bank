import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

const en = require('../Locales/en.json');
const ptBR = require('../Locales/pt-BR.json');
const ptAO = require('../Locales/pt-AO.json');

// Define the supported translations
I18n.translations['en'] = {...I18n.translations['en'], ...en }
I18n.translations['pt-BR'] = {...I18n.translations['pt-BR'], ...ptBR }
I18n.translations['pt-AO'] = {...I18n.translations['pt-AO'], ...ptAO }

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL =
	currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Localizing momentjs
if (currentLocale.indexOf('pt-BR') === 0) {
	require('moment/locale/pt.js');
	moment.locale('pt');
} else if (currentLocale.indexOf('pt-AO') === 0) {
	require('moment/locale/pt.js');
	moment.locale('pt');
} else {
	moment.locale('en');
}

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return I18n.t(name, params);
}

export default I18n;