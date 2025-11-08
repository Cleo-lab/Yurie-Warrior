"use client"

import { useI18n } from "@/context/i18n-context"

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="max-w-3xl text-center space-y-6 fade-in">
        {/* Character Avatar */}
        <div className="flex justify-center mb-8">
  <div className="w-60 h-60 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1">
    <img
      src="/videos/Yurie_main.webp"
      alt="Yurie"
      className="w-60 h-60 rounded-full object-cover shadow-lg select-none"
      draggable="false"
    />
  </div>
</div>

        <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-foreground via-neon to-glow bg-clip-text text-transparent">
          {t("hero.title")}
        </h1>

        <p className="text-3xl md:text-5xl font-bold text-gray-700 max-w-2xl mx-auto text-balance">
  {t("hero.subtitle")}
</p>

        <div className="flex gap-4 justify-center pt-8 flex-wrap">
          <a
            href="#blog"
            className="px-8 py-3 bg-primary text-foreground rounded-full font-semibold hover:shadow-lg glow-effect transition-all"
          >
            Read Stories
          </a>
          <a
            href="#support"
            className="px-8 py-3 bg-secondary text-foreground rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Support Me
          </a>
        </div>
      </div>
    </section>
  )
}
