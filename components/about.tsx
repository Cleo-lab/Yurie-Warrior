"use client"

import { useI18n } from "@/context/i18n-context"

export default function About() {
  const { t } = useI18n()

  return (
    <section id="about" className="py-20 px-4 bg-muted/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-heading font-bold mb-8 text-center">{t("about.title")}</h2>

        <div className="bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl p-8 md:p-12 border border-border slide-up">
          <p className="text-lg text-foreground/80 leading-relaxed text-balance">{t("about.description")}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { emoji: "✍️", label: "Writer" },
              { emoji: "🎨", label: "Artist" },
              { emoji: "💭", label: "Dreamer" },
              { emoji: "✨", label: "Creator" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-4 bg-background/50 rounded-lg border border-border hover:border-neon transition-all"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
