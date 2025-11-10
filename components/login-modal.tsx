"use client"

import type React from "react"

import { useState } from "react"
import { useI18n } from "@/context/i18n-context"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useI18n()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim()) {
      setName("")
      setEmail("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-md w-full border border-border">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">{t("auth.login")}</h2>
          <button onClick={onClose} className="text-2xl hover:opacity-60 transition-opacity">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("auth.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("auth.namePlaceholder")}
              className="w-full px-3 py-2 bg-accent/20 border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("auth.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              className="w-full px-3 py-2 bg-accent/20 border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              {t("auth.cancel")}
            </Button>
            <Button type="submit" className="flex-1 bg-neon text-background hover:opacity-90">
              {t("auth.login")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
