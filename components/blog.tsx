"use client"

import { useState, Suspense, lazy } from "react"
import Image from "next/image"
import { useI18n } from "@/context/i18n-context"

const Comments = lazy(() => import("@/components/comments"))

interface Post {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  content: string
}

function BlogPostCards({ posts, onSelectPost }: { posts: Post[]; onSelectPost: (post: Post) => void }) {
  const { t } = useI18n()

  return (
    <div className="blog-cards grid md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="blog-card bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden border border-border hover:border-neon hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => onSelectPost(post)}
        >
          <div className="blog-card-image relative h-48 bg-border overflow-hidden">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={75}
              className="blog-card-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="blog-card-content p-6">
            <time className="blog-card-date text-sm text-foreground/60">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            <h3 className="blog-card-title text-xl font-bold mt-2 mb-3">{post.title}</h3>
            <p className="blog-card-excerpt text-foreground/70 text-sm mb-4">{post.excerpt}</p>

            <button className="blog-card-cta text-neon font-semibold hover:gap-2 flex items-center transition-all">
              {t("blog.readMore")} →
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function BlogModal({ post, onClose }: { post: Post; onClose: () => void }) {
  return (
    <div
      className="blog-modal fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="blog-modal-content bg-background rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="blog-modal-header sticky top-0 flex justify-between items-center p-6 border-b border-border bg-background/95">
          <h2 className="blog-modal-title text-2xl font-bold">{post.title}</h2>
          <button onClick={onClose} className="blog-modal-close text-2xl">
            ✕
          </button>
        </div>

        <div className="blog-modal-body p-6 space-y-4">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={600}
            height={400}
            quality={85}
            className="blog-modal-image w-full h-80 object-cover rounded-lg"
          />
          <p className="blog-modal-date text-sm text-foreground/60">{new Date(post.date).toLocaleDateString()}</p>
          <p className="blog-modal-content text-lg leading-relaxed text-foreground/80">{post.content}</p>

          <div className="blog-modal-comments mt-8 pt-8 border-t border-border">
            <h3 className="font-bold mb-4">Comments</h3>
            <Suspense fallback={<div className="text-foreground/60">Loading comments...</div>}>
              <Comments postId={post.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog() {
  const { t } = useI18n()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

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
    <section id="blog" className="blog-section py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="blog-title text-4xl font-heading font-bold mb-12 text-center">{t("blog.title")}</h2>

        <BlogPostCards posts={posts} onSelectPost={setSelectedPost} />

        {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </div>
    </section>
  )
}
