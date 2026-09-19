import english from "./en";
import portugueseBrazil from "./pt-BR";

const DEFAULT_LANGUAGE = "en";
const dictionaries = {
  en: english,
  "pt-BR": portugueseBrazil,
};

function getTranslation(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary);
}

export function translate(language, key, variables = {}) {
  const dictionary = dictionaries[language] ?? dictionaries[DEFAULT_LANGUAGE];
  let text =
    getTranslation(dictionary, key) ??
    getTranslation(dictionaries[DEFAULT_LANGUAGE], key) ??
    key;

  for (const [name, value] of Object.entries(variables)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }

  return text;
}

export function translateCount(language, key, count, variables = {}) {
  const form = count === 1 ? "one" : "other";
  return translate(language, `${key}.${form}`, { count, ...variables });
}

export function setDocumentLanguage(language) {
  document.documentElement.lang = dictionaries[language] ? language : DEFAULT_LANGUAGE;
}
