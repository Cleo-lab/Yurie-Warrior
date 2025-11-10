"use client"

import type React from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { AuthProvider } from "@/context/auth-context"
import { I18nProvider } from "@/context/i18n-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>{children}</AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}
