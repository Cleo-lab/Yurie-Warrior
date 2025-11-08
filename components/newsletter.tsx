"use client"

import type React from "react"
import { useState } from "react"
import { useI18n } from "@/context/i18n-context"
import { supabase } from "@/lib/supabase"

export default function Newsletter() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const { error: supabaseError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim() })

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          setError('This email is already subscribed!')
        } else {
          throw supabaseError
        }
        return
      }

      setSubmitted(true)
      setTimeout(() => {
        setEmail("")
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Newsletter error:', err)
      setError('Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-heading font-bold">{t("newsletter.title")}</h2>
          <p className="text-lg text-foreground/70">{t("newsletter.description")}</p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-neon text-background font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              {t("newsletter.subscribe")}
            </button>
          </form>

          {submitted && (
            <p className="text-primary font-semibold animate-pulse">Thanks for subscribing! ✨</p>
          )}
          {error && (
            <p className="text-red-500 font-semibold">{error}</p>
          )}
        </div>
      </div>
    </section>
  )
}