import I18n from 'react-native-i18n';

const en = require('../Locales/en.json');
const es = require('../Locales/es.json');
const ptBR = require('../Locales/pt-BR.json');
const ptAO = require('../Locales/pt-AO.json');

// Define the supported translation
I18n.translations['es'] = { ...es, ...I18n.translations['es'] }
I18n.translations['es-cl'] = { ...es, ...I18n.translations['es-cl'] }
I18n.translations['en'] = { ...en, ...I18n.translations['en'] }
I18n.translations['en-US'] = { ...en, ...I18n.translations['en-US'] }
I18n.translations['pt-BR'] = { ...ptBR, ...I18n.translations['pt-BR'] }
I18n.translations['pt-AO'] = {...ptAO, ...I18n.translations['pt-AO'] }
I18n.translations['ao'] = {...ptAO, ...I18n.translations['ao'] }
I18n.translations['pt-PT'] = {...ptAO, ...I18n.translations['pt-PT'] }

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return I18n.t(name, params);
}

export default I18n;