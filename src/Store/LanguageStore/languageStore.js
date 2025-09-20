import { create } from 'zustand';

const useLanguageStore = create((set) => ({
  lang: localStorage.getItem('lang') || 'ar', 
  setLang: (lang) => {
    localStorage.setItem('lang', lang); 
    set({ lang });
  },
  toggleLang: () =>
    set((state) => {
      const newLang = state.lang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('lang', newLang);
      return { lang: newLang };
    }),
}));

export default useLanguageStore;
