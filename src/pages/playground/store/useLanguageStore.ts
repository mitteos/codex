import { create } from 'zustand'

interface LanguageState {
  language: string
  setLanguage: (language: string) => void
}

const useLanguageStore = create<LanguageState>()((set) => ({
  language: 'javascript',
  setLanguage: (language: string) => set({ language })
}))

export default useLanguageStore
