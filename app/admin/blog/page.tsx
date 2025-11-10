"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import ImageUploader from "@/components/image-uploader"

interface Post {
  id: number
  title: string
  excerpt: string
  content: string
  image_url: string | null
  date: string
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
      alert("Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Please fill in all required fields")
      return
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            image_url: formData.image_url || null,
            date: formData.date,
          })
          .eq("id", editingId)

        if (error) throw error
        alert("Post updated successfully!")
      } else {
        const { error } = await supabase.from("posts").insert({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          image_url: formData.image_url || null,
          date: formData.date,
        })

        if (error) throw error
        alert("Post created successfully!")
      }

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image_url: "",
        date: new Date().toISOString().split("T")[0],
      })
      setEditingId(null)
      setShowForm(false)
      fetchPosts()
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    }
  }

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || "",
      date: post.date,
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const { error } = await supabase.from("posts").delete().eq("id", id)

      if (error) throw error
      alert("Post deleted successfully!")
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image_url: "",
      date: new Date().toISOString().split("T")[0],
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-foreground/60">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-foreground/60">Create, edit, and manage your blog posts</p>
          </div>
          <Link href="/" className="text-sm text-neon hover:underline">
            ← Back to Blog
          </Link>
        </div>

        {showForm && (
          <div className="admin-form bg-card rounded-xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Post" : "Create New Post"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post title"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt *</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short summary of the post"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full post content"
                  rows={6}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Post Image</label>
                <ImageUploader
                  onImageUrl={(url) => setFormData({ ...formData, image_url: url })}
                  bucket="blog-images"
                />
                {formData.image_url && (
                  <div className="mt-3 p-3 bg-border/30 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-2">Image uploaded:</p>
                    <img src={formData.image_url} alt="Preview" className="h-32 object-cover rounded" />
                  </div>
                )}
                <p className="text-xs text-foreground/50 mt-2">Or paste image URL manually:</p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors text-sm mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-neon text-background hover:opacity-90">
                  {editingId ? "Update Post" : "Create Post"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-border text-foreground hover:opacity-80"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-8 bg-neon text-background hover:opacity-90">
            + New Post
          </Button>
        )}

        <div className="admin-posts grid gap-6">
          {posts.length === 0 ? (
            <div className="text-center text-foreground/60 py-12">No posts yet. Create your first post!</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="admin-post-card bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-foreground/70 text-sm mb-3">{post.excerpt}</p>
                    <p className="text-xs text-foreground/50">
                      Published: {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>

                  <div className="admin-post-actions flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleEdit(post)}
                      className="px-4 py-2 text-sm bg-secondary text-foreground hover:opacity-80"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
