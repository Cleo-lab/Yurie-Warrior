"use client"

import { useI18n } from "@/context/i18n-context"

export default function Gallery() {
  const { t } = useI18n()

  const artworks = [
    { id: 1, query: "anime-girl-digital-art" },
    { id: 2, query: "pastel-neon-aesthetic" },
    { id: 3, query: "dreamy-sky-stars" },
    { id: 4, query: "cyber-romantic-illustration" },
    { id: 5, query: "cozy-room-anime-style" },
    { id: 6, query: "digital-art-galaxy" },
  ]

  return (
    <section id="gallery" className="py-20 px-4 bg-muted/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-heading font-bold mb-4 text-center">{t("gallery.title")}</h2>
        <p className="text-center text-foreground/70 mb-12">{t("gallery.description")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className="relative group h-64 rounded-xl overflow-hidden border border-border hover:border-neon transition-all duration-300"
            >
              <img
                src={`/.jpg?height=300&width=400&query=${artwork.query}`}
                alt={`Art ${artwork.id}`}
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="text-white p-4">
                  <p className="font-semibold">Digital Art #{artwork.id}</p>
                </div>
              </div>

              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 glow-effect pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
