import { createContext, useContext, useState } from 'react';
import { translations, LANGUAGES } from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('abyride-lang') || 'en'; }
    catch { return 'en'; }
  });

  const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  const setLanguage = (code) => {
    setLang(code);
    try { localStorage.setItem('abyride-lang', code); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
