"use client"

import { useI18n } from "@/context/i18n-context"
import { useAuth } from "@/context/auth-context"
import { useState } from "react"

export default function Header() {
  const { language, setLanguage, t } = useI18n()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-3xl">🌸</div>
            <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="neon-hover transition-glow">
              {t("nav.about")}
            </a>
            <a href="#blog" className="neon-hover transition-glow">
              {t("nav.blog")}
            </a>
            <a href="#gallery" className="neon-hover transition-glow">
              {t("nav.gallery")}
            </a>
            <a href="#support" className="neon-hover transition-glow">
              {t("nav.support")}
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-border/50 p-1 rounded-lg">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded transition-all ${
                  language === "en" ? "bg-primary text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`px-3 py-1 rounded transition-all ${
                  language === "es" ? "bg-secondary text-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                ES
              </button>
            </div>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-border"
                />
                <a
                  href="/profile"
                  className="px-3 py-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  {t("auth.profile")}
                </a>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  {t("auth.logout")}
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  {t("auth.login")}
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 text-sm bg-neon text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t("auth.register")}
                </a>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden bg-background border-t border-border p-4 space-y-3">
            <a href="#about" className="block neon-hover transition-glow">
              {t("nav.about")}
            </a>
            <a href="#blog" className="block neon-hover transition-glow">
              {t("nav.blog")}
            </a>
            <a href="#gallery" className="block neon-hover transition-glow">
              {t("nav.gallery")}
            </a>
            <a href="#support" className="block neon-hover transition-glow">
              {t("nav.support")}
            </a>
            <div className="pt-3 border-t border-border mt-3 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-border"
                    />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <a
                    href="/profile"
                    className="block px-2 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {t("auth.profile")}
                  </a>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-2 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {t("auth.logout")}
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <a
                    href="/login"
                    className="block px-3 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors text-center"
                  >
                    {t("auth.login")}
                  </a>
                  <a
                    href="/register"
                    className="block w-full px-3 py-2 text-sm bg-neon text-background rounded-lg hover:opacity-90 transition-opacity text-center"
                  >
                    {t("auth.register")}
                  </a>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
