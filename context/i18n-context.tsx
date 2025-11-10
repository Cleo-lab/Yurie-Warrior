"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import en from "@/translations/en.json"
import es from "@/translations/es.json"

type Language = "en" | "es"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, typeof en> = {
  en,
  es,
}

function getDefaultLanguage(): Language {
  if (typeof window === "undefined") {
    return "en"
  }
  const savedLanguage = localStorage.getItem("language") as Language | null
  if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
    return savedLanguage
  }
  return "en"
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialLanguage = getDefaultLanguage()
    setLanguageState(initialLanguage)
    setMounted(true)
  }, [])

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }, [])

  const t = useCallback((key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
