"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

interface Subscriber {
  id: string
  email: string
  subscribed_at: string
}

interface Comment {
  id: string
  post_id: number
  author_name: string
  author_email: string
  author_avatar: string | null
  text: string
  created_at: string
  parent_comment_id: string | null
  post_title?: string
}

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  uploaded_at: string
}

type AdminTab = "posts" | "newsletter" | "comments" | "gallery" | "send-newsletter"

export default function AdminDashboard() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>("posts")

  // Posts state
  const [posts, setPosts] = useState<Post[]>([])
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [postFormData, setPostFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Newsletter state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subscriberSearch, setSubscriberSearch] = useState("")

  // Comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    description: "",
    image_url: "",
  })
  const [showGalleryForm, setShowGalleryForm] = useState(false)

  // Loading states
  const [postsLoading, setPostsLoading] = useState(true)
  const [subscribersLoading, setSubscribersLoading] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  // Send Newsletter state
  const [postTitleForNewsletter, setPostTitleForNewsletter] = useState("")
  const [postExcerptForNewsletter, setPostExcerptForNewsletter] = useState("")
  const [postUrlForNewsletter, setPostUrlForNewsletter] = useState("")
  const [sendingNewsletter, setSendingNewsletter] = useState(false)
  const [newsletterResult, setNewsletterResult] = useState("")

  

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token !== "admin-token") {
      router.replace("/admin/login")
    } else {
      setAuthorized(true)
    }
  }, [router])

  // Fetch data when tab changes
  useEffect(() => {
  if (!authorized) return

  if (activeTab === "posts") {
    fetchPosts()
  } else if (activeTab === "newsletter") {
    fetchSubscribers()
  } else if (activeTab === "comments") {
    fetchComments()
  } else if (activeTab === "gallery") {
    fetchGallery()
  } else if (activeTab === "send-newsletter") {
    // Загружаем подписчиков для отображения счётчика
    if (subscribers.length === 0) {
      fetchSubscribers()
    }
  }
  }, [activeTab, authorized])

  // ========== POSTS FUNCTIONS ==========
  const fetchPosts = async () => {
    setPostsLoading(true)
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
      setPostsLoading(false)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!postFormData.title || !postFormData.excerpt || !postFormData.content) {
      alert("Please fill in all required fields")
      return
    }

    try {
      if (editingPostId) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: postFormData.title,
            excerpt: postFormData.excerpt,
            content: postFormData.content,
            image_url: postFormData.image_url || null,
            date: postFormData.date,
          })
          .eq("id", editingPostId)

        if (error) throw error
        alert("Post updated successfully!")
      } else {
        const { error } = await supabase.from("posts").insert({
          title: postFormData.title,
          excerpt: postFormData.excerpt,
          content: postFormData.content,
          image_url: postFormData.image_url || null,
          date: postFormData.date,
        })

        if (error) throw error
        alert("Post created successfully!")
      }

      setPostFormData({
        title: "",
        excerpt: "",
        content: "",
        image_url: "",
        date: new Date().toISOString().split("T")[0],
      })
      setEditingPostId(null)
      setShowPostForm(false)
      fetchPosts()
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Failed to save post")
    }
  }

  const handleEditPost = (post: Post) => {
    setPostFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || "",
      date: post.date,
    })
    setEditingPostId(post.id)
    setShowPostForm(true)
  }

  const handleDeletePost = async (id: number) => {
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

  const handlePostCancel = () => {
    setPostFormData({
      title: "",
      excerpt: "",
      content: "",
      image_url: "",
      date: new Date().toISOString().split("T")[0],
    })
    setEditingPostId(null)
    setShowPostForm(false)
  }

  // ========== NEWSLETTER FUNCTIONS ==========
  const fetchSubscribers = async () => {
    setSubscribersLoading(true)
    try {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false })

      if (error) throw error
      setSubscribers(data || [])
    } catch (error) {
      console.error("Error fetching subscribers:", error)
      alert("Failed to fetch subscribers")
    } finally {
      setSubscribersLoading(false)
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id)

      if (error) throw error
      alert("Subscriber removed")
      fetchSubscribers()
    } catch (error) {
      console.error("Error deleting subscriber:", error)
      alert("Failed to remove subscriber")
    }
  }

  // ========== COMMENTS FUNCTIONS ==========
  const fetchComments = async () => {
    setCommentsLoading(true)
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false })

      if (commentsError) throw commentsError

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, title")

      if (postsError) throw postsError

      const postsMap = new Map(postsData?.map((p: any) => [p.id, p.title]) || [])
      const commentsWithPostTitle = (commentsData || []).map((c: any) => ({
        ...c,
        post_title: postsMap.get(c.post_id) || "Unknown",
      }))

      setComments(commentsWithPostTitle as Comment[])
    } catch (error) {
      console.error("Error fetching comments:", error)
      alert("Failed to fetch comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm("Delete this comment?")) return

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)

      if (error) throw error
      alert("Comment deleted")
      fetchComments()
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Failed to delete comment")
    }
  }

  const handleReplyComment = async (parentCommentId: string) => {
    if (!replyText.trim()) {
      alert("Reply text cannot be empty")
      return
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          post_id: comments.find((c) => c.id === parentCommentId)?.post_id || 0,
          author_name: "Admin Response",
          author_email: "admin@blog.local",
          author_avatar: "/placeholder.svg",
          text: replyText,
          parent_comment_id: parentCommentId,
        })

      if (error) throw error
      alert("Reply posted successfully!")
      setReplyingTo(null)
      setReplyText("")
      fetchComments()
    } catch (error) {
      console.error("Error posting reply:", error)
      alert("Failed to post reply")
    }
  }

  // ========== GALLERY FUNCTIONS ==========
  const fetchGallery = async () => {
    setGalleryLoading(true)
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("uploaded_at", { ascending: false })

      if (error) {
        if (error.code === "PGRST116") {
          console.log("Gallery table not found, creating it...")
          setGalleryItems([])
        } else {
          throw error
        }
      } else {
        setGalleryItems(data || [])
      }
    } catch (error) {
      console.error("Error fetching gallery:", error)
      setGalleryItems([])
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!galleryForm.title || !galleryForm.image_url) {
      alert("Title and image are required")
      return
    }

    try {
      const { error } = await supabase
        .from("gallery")
        .insert({
          title: galleryForm.title,
          description: galleryForm.description,
          image_url: galleryForm.image_url,
        })

      if (error) {
        if (error.code === "PGRST116") {
          alert("Gallery table not found in Supabase. Please create it first.")
          return
        }
        throw error
      }

      alert("Image added to gallery!")
      setGalleryForm({ title: "", description: "", image_url: "" })
      setShowGalleryForm(false)
      fetchGallery()
    } catch (error) {
      console.error("Error adding gallery item:", error)
      alert("Failed to add gallery item")
    }
  }

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm("Delete this image?")) return

    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", id)

      if (error) throw error
      alert("Image deleted")
      fetchGallery()
    } catch (error) {
      console.error("Error deleting gallery item:", error)
      alert("Failed to delete image")
    }
  }
  // ========== SEND NEWSLETTER FUNCTION ==========
const handleSendNewsletter = async () => {
  if (!postTitleForNewsletter || !postExcerptForNewsletter || !postUrlForNewsletter) {
    alert("Please fill all fields")
    return
  }

  setSendingNewsletter(true)
  setNewsletterResult("")

  try {
    const response = await fetch("/api/send-newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token",
      },
      body: JSON.stringify({
        postTitle: postTitleForNewsletter,
        postExcerpt: postExcerptForNewsletter,
        postUrl: postUrlForNewsletter,
      }),
    })

    const data = await response.json()
    setNewsletterResult(JSON.stringify(data, null, 2))

    if (response.ok) {
      alert("✅ Newsletter sent successfully!")
      setPostTitleForNewsletter("")
      setPostExcerptForNewsletter("")
      setPostUrlForNewsletter("")
    } else {
      alert(`❌ Failed to send: ${data?.error || "Unknown error"}`)
    }
  } catch (error) {
    console.error("Newsletter send error:", error)
    setNewsletterResult(`Error: ${error}`)
  } finally {
    setSendingNewsletter(false)
  }
}

  // ========== UI RENDERING ==========
  if (!authorized) return null

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.replace("/admin/login")
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Blog Management</h1>
            <p className="text-foreground/60">Manage posts, newsletter, comments, and gallery</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-neon hover:underline">
              ← Back to Blog
            </Link>
            <Button onClick={handleLogout} variant="outline">
              🚪 Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-navigation mb-8 flex gap-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "posts"
                ? "border-neon text-neon"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            📝 Posts
          </button>
          <button
            onClick={() => setActiveTab("newsletter")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "newsletter"
                ? "border-neon text-neon"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            📧 Newsletter
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "comments"
                ? "border-neon text-neon"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            💬 Comments
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "gallery"
                ? "border-neon text-neon"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            🎨 Gallery
          </button>
          <button
            onClick={() => setActiveTab("send-newsletter")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "send-newsletter"
                ? "border-neon text-neon"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            ✉️ Send Newsletter
</button>
        </div>

        {/* POSTS TAB */}
        {activeTab === "posts" && (
          <div className="admin-posts-section">
            {showPostForm && (
              <div className="admin-form bg-card rounded-xl border border-border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingPostId ? "Edit Post" : "Create New Post"}
                </h2>

                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={postFormData.title}
                      onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                      placeholder="Post title"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Excerpt *</label>
                    <input
                      type="text"
                      value={postFormData.excerpt}
                      onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                      placeholder="Short summary of the post"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content *</label>
                    <textarea
                      value={postFormData.content}
                      onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                      placeholder="Full post content"
                      rows={6}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Post Image</label>
                    <ImageUploader
                      onImageUrl={(url) => setPostFormData({ ...postFormData, image_url: url })}
                      bucket="blog-images"
                    />
                    {postFormData.image_url && (
                      <div className="mt-3 p-3 bg-border/30 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-2">Image uploaded:</p>
                        <img
                          src={postFormData.image_url}
                          alt="Preview"
                          className="h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    <p className="text-xs text-foreground/50 mt-2">Or paste image URL manually:</p>
                    <input
                      type="url"
                      value={postFormData.image_url}
                      onChange={(e) => setPostFormData({ ...postFormData, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={postFormData.date}
                      onChange={(e) => setPostFormData({ ...postFormData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-neon text-background hover:opacity-90"
                    >
                      {editingPostId ? "Update Post" : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePostCancel}
                      className="flex-1 bg-border text-foreground hover:opacity-80"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!showPostForm && (
              <Button
                onClick={() => setShowPostForm(true)}
                className="mb-8 bg-neon text-background hover:opacity-90"
              >
                + New Post
              </Button>
            )}

            {postsLoading ? (
              <div className="text-center text-foreground/60">Loading posts...</div>
            ) : (
              <div className="admin-posts grid gap-6">
                {posts.length === 0 ? (
                  <div className="text-center text-foreground/60 py-12">
                    No posts yet. Create your first post!
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="admin-post-card bg-card rounded-lg border border-border p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-foreground/70 text-sm mb-3">{post.excerpt}</p>
                          <p className="text-xs text-foreground/50">
                            Published:{" "}
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="admin-post-actions flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleEditPost(post)}
                            className="px-4 py-2 text-sm bg-secondary text-foreground hover:opacity-80"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeletePost(post.id)}
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
            )}
          </div>
        )}
{/* SEND NEWSLETTER TAB */}
{activeTab === "send-newsletter" && (
  <div className="admin-newsletter-send-section">
    <div className="bg-card rounded-xl border border-border p-8 space-y-6">
      <h2 className="text-2xl font-bold">📧 Send Newsletter to Subscribers</h2>
      <p className="text-foreground/60">
        Total subscribers: {subscribers.length || 0}
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Post Title *</label>
          <input
            type="text"
            value={postTitleForNewsletter}
            onChange={(e) => setPostTitleForNewsletter(e.target.value)}
            placeholder="My Amazing New Post"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt (Preview) *</label>
          <textarea
            value={postExcerptForNewsletter}
            onChange={(e) => setPostExcerptForNewsletter(e.target.value)}
            placeholder="A short description of what this post is about..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Post URL *</label>
          <input
            type="url"
            value={postUrlForNewsletter}
            onChange={(e) => setPostUrlForNewsletter(e.target.value)}
            placeholder="https://yourblog.com/posts/my-post"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon"
          />
        </div>

        <Button
          onClick={handleSendNewsletter}
          disabled={sendingNewsletter}
          className="w-full bg-neon text-background hover:opacity-90 font-bold py-6 text-lg"
        >
          {sendingNewsletter ? "📤 Sending..." : "✉️ Send to All Subscribers"}
        </Button>
      </div>

      {newsletterResult && (
        <div className="bg-accent/20 p-6 rounded-xl border border-border mt-6">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-xs overflow-auto bg-background p-4 rounded">
            {newsletterResult}
          </pre>
        </div>
      )}

      <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-sm">
        <p className="font-bold mb-2">💡 How to use:</p>
        <ol className="list-decimal list-inside space-y-1 text-foreground/70">
          <li>Create a new blog post first</li>
          <li>Fill in the post title, excerpt, and URL above</li>
          <li>Click "Send to All Subscribers"</li>
          <li>All subscribers will receive an email notification!</li>
        </ol>
      </div>
    </div>
  </div>
)}
        {/* NEWSLETTER TAB */}
        {activeTab === "newsletter" && (
          <div className="admin-newsletter-section">
            <div className="mb-6">
              <input
                type="email"
                placeholder="Search subscribers..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
              />
            </div>

            {subscribersLoading ? (
              <div className="text-center text-foreground/60">Loading subscribers...</div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-foreground/60 mb-4">
                  Total subscribers: {subscribers.length}
                </div>

                {subscribers.length === 0 ? (
                  <div className="text-center text-foreground/60 py-12">
                    No subscribers yet.
                  </div>
                ) : (
                  subscribers
                    .filter((s) => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()))
                    .map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="subscriber-card bg-card rounded-lg border border-border p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          <p className="text-xs text-foreground/50">
                            Subscribed:{" "}
                            {new Date(subscriber.subscribed_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                          className="px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
{activeTab === "comments" && (
  <div className="admin-comments-section">
    {commentsLoading ? (
      <div className="text-center text-foreground/60">Loading comments...</div>
    ) : comments.length === 0 ? (
      <div className="text-center text-foreground/60 py-12">No comments yet.</div>
    ) : (
      <div className="space-y-6">
        {/* Фильтруем только родительские комментарии */}
        {comments
          .filter((c) => !c.parent_comment_id)
          .map((parentComment) => {
            // Находим все ответы на этот комментарий
            const replies = comments.filter((c) => c.parent_comment_id === parentComment.id)
            
            return (
              <div
                key={parentComment.id}
                className="comment-thread bg-card rounded-lg border border-border overflow-hidden"
              >
                {/* Родительский комментарий */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex gap-4">
                    <img
                      src={parentComment.author_avatar || "/placeholder.svg"}
                      alt={parentComment.author_name}
                      className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {/* Шапка комментария */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-bold text-base">{parentComment.author_name}</p>
                          <p className="text-xs text-foreground/50">
                            {parentComment.author_email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-3 py-1 rounded-full bg-neon/20 text-neon font-medium">
                            📝 {parentComment.post_title}
                          </span>
                          <span className="text-xs text-foreground/50 whitespace-nowrap">
                            {new Date(parentComment.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            {new Date(parentComment.created_at).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Текст комментария */}
                      <div className="bg-accent/10 rounded-lg p-4 mb-3">
                        <p className="text-sm text-foreground leading-relaxed">
                          {parentComment.text}
                        </p>
                      </div>

                      {/* Действия */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            setReplyingTo(replyingTo === parentComment.id ? null : parentComment.id)
                          }
                          className="text-xs px-4 py-2 bg-neon/20 text-neon hover:bg-neon/30 font-medium"
                        >
                          {replyingTo === parentComment.id ? "❌ Cancel Reply" : "💬 Reply as Admin"}
                        </Button>
                        <Button
                          onClick={() => handleDeleteComment(parentComment.id)}
                          className="text-xs px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium"
                        >
                          🗑️ Delete
                        </Button>
                        {replies.length > 0 && (
                          <span className="text-xs px-3 py-2 bg-border/50 rounded-lg text-foreground/60 font-medium">
                            {replies.length} {replies.length === 1 ? "reply" : "replies"}
                          </span>
                        )}
                      </div>

                      {/* Форма ответа админа */}
                      {replyingTo === parentComment.id && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">👑</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-neon mb-1">Admin Response</p>
                              <p className="text-xs text-foreground/50">
                                Replying to {parentComment.author_name}
                              </p>
                            </div>
                          </div>
                          
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your admin response..."
                            rows={4}
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors text-sm resize-none mb-3"
                            autoFocus
                          />
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleReplyComment(parentComment.id)}
                              disabled={!replyText.trim()}
                              className="px-5 py-2 text-sm bg-neon text-background hover:opacity-90 font-medium disabled:opacity-50"
                            >
                              ✉️ Send Reply
                            </Button>
                            <Button
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText("")
                              }}
                              className="px-5 py-2 text-sm bg-border text-foreground hover:opacity-80"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Вложенные ответы (replies) */}
                {replies.length > 0 && (
                  <div className="bg-accent/5 p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-border"></div>
                      <span className="text-xs font-medium text-foreground/50 px-3">
                        💬 {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
                      </span>
                      <div className="h-px flex-1 bg-border"></div>
                    </div>

                    {replies.map((reply, index) => (
                      <div
                        key={reply.id}
                        className={`reply-item flex gap-4 pb-4 ${
                          index !== replies.length - 1 ? "border-b border-border/30" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden">
                            <img
                              src={reply.author_avatar || "/placeholder.svg"}
                              alt={reply.author_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Линия соединения */}
                          {index !== replies.length - 1 && (
                            <div className="w-px h-full bg-border/30 mt-2"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-sm flex items-center gap-2">
                                {reply.author_name}
                                {reply.author_name === "Admin Response" && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-neon/20 text-neon">
                                    👑 Admin
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-foreground/50">
                                {new Date(reply.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                at{" "}
                                {new Date(reply.created_at).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleDeleteComment(reply.id)}
                              className="text-xs px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex-shrink-0"
                            >
                              Delete
                            </Button>
                          </div>

                          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
      </div>
    )}
  </div>
)}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="admin-gallery-section">
            {showGalleryForm && (
              <div className="gallery-form bg-card rounded-xl border border-border p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Add Image to Gallery</h2>

                <form onSubmit={handleAddGalleryItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                      placeholder="Image title"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      placeholder="Image description (optional)"
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image *</label>
                    <ImageUploader
                      onImageUrl={(url) => setGalleryForm({ ...galleryForm, image_url: url })}
                      bucket="gallery"
                    />
                    {galleryForm.image_url && (
                      <div className="mt-3 p-3 bg-border/30 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-2">Image uploaded:</p>
                        <img
                          src={galleryForm.image_url}
                          alt="Preview"
                          className="h-40 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-neon text-background hover:opacity-90"
                    >
                      Add to Gallery
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowGalleryForm(false)
                        setGalleryForm({ title: "", description: "", image_url: "" })
                      }}
                      className="flex-1 bg-border text-foreground hover:opacity-80"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {!showGalleryForm && (
              <Button
                onClick={() => setShowGalleryForm(true)}
                className="mb-8 bg-neon text-background hover:opacity-90"
              >
                + Add Image
              </Button>
            )}

            {galleryLoading ? (
              <div className="text-center text-foreground/60">Loading gallery...</div>
            ) : (
              <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.length === 0 ? (
                  <div className="col-span-full text-center text-foreground/60 py-12">
                    No images in gallery yet. Add your first image!
                  </div>
                ) : (
                  galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="gallery-item-card bg-card rounded-lg border border-border overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden bg-accent/20">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-foreground/70 mb-3">{item.description}</p>
                        )}
                        <p className="text-xs text-foreground/50 mb-4">
                          {new Date(item.uploaded_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <Button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="w-full px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
