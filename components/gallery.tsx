"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useI18n } from "@/context/i18n-context"
import { supabase } from "@/lib/supabase"

interface GalleryItem {
  id: string
  title: string
  description: string | null
  image_url: string
  uploaded_at: string
}

export default function Gallery() {
  const { t } = useI18n()
  const [artworks, setArtworks] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("uploaded_at", { ascending: false })

      if (error) throw error
      setArtworks(data || [])
    } catch (error) {
      console.error("Error fetching gallery:", error)
      setArtworks([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="gallery" className="py-20 px-4 bg-muted/40">
        <div className="max-w-6xl mx-auto text-center text-foreground/60">
          Loading gallery...
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="py-20 px-4 bg-muted/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-heading font-bold mb-4 text-center">{t("gallery.title")}</h2>
        <p className="text-center text-foreground/70 mb-12">{t("gallery.description")}</p>

        {artworks.length === 0 ? (
          <div className="text-center text-foreground/60 py-12">
            No artworks in gallery yet. Check back soon!
          </div>
        ) : (
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="gallery-item relative group h-64 rounded-xl overflow-hidden border border-border hover:border-neon transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(artwork)}
              >
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={75}
                  className="gallery-image w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                />

                <div className="gallery-overlay absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="gallery-overlay-text text-white p-4 w-full">
                    <p className="font-bold text-lg mb-1">{artwork.title}</p>
                    {artwork.description && (
                      <p className="text-sm text-white/80 line-clamp-2">{artwork.description}</p>
                    )}
                  </div>
                </div>

                <div className="gallery-glow absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 glow-effect pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Modal для просмотра изображения */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-neon transition-colors"
              >
                ✕
              </button>
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                quality={90}
              />
              <div className="mt-4 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/80">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}