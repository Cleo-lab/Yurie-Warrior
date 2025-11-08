"use client"

import { useState } from "react"
import { useI18n } from "@/context/i18n-context"
import Comments from "@/components/comments"

interface Post {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  content: string
}

export default function Blog() {
  const { t } = useI18n()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // Example posts - replace with dynamic data
  const posts: Post[] = [
    {
      id: 1,
      title: "My Favorite Anime Worlds",
      excerpt: "Exploring the digital worlds that inspire my art...",
      date: "2025-01-15",
      image: "/anime-scenery.jpg",
      content:
        "There are so many incredible anime worlds that have shaped my creativity. From the neon streets of Neo-Tokyo to the peaceful countryside of Studio Ghibli films, each world tells a story...",
    },
    {
      id: 2,
      title: "A Quiet Night Under Neon Skies",
      excerpt: "Reflections on solitude and the beauty of the night...",
      date: "2025-01-10",
      image: "/neon-night-city.jpg",
      content:
        "Sometimes the best moments are the quiet ones. When the city lights blur into stars and you can hear your own thoughts clearly. Tonight, sitting by the window, I felt truly alive...",
    },
    {
      id: 3,
      title: "Dreams Smell Like Rain and Coffee",
      excerpt: "A sensory journey through my creative process...",
      date: "2025-01-05",
      image: "/cozy-coffee-desk.jpg",
      content:
        "Every dream I chase smells like fresh rain and warm coffee. These are the scents that ground me when my imagination flies too far. They remind me that creativity is rooted in simple pleasures...",
    },
  ]

  return (
    <section id="blog" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-heading font-bold mb-12 text-center">{t("blog.title")}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden border border-border hover:border-neon hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative h-48 bg-border overflow-hidden">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <time className="text-sm text-foreground/60">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <h3 className="text-xl font-bold mt-2 mb-3">{post.title}</h3>
                <p className="text-foreground/70 text-sm mb-4">{post.excerpt}</p>

                <button className="text-neon font-semibold hover:gap-2 flex items-center transition-all">
                  {t("blog.readMore")} →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Post Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-background rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex justify-between items-center p-6 border-b border-border bg-background/95">
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <button onClick={() => setSelectedPost(null)} className="text-2xl">
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <img
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <p className="text-sm text-foreground/60">{new Date(selectedPost.date).toLocaleDateString()}</p>
                <p className="text-lg leading-relaxed text-foreground/80">{selectedPost.content}</p>

                {/* Comments Section Placeholder */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-bold mb-4">Comments</h3>
                  <Comments postId={selectedPost.id} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
