"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserComment {
  id: string
  post_id: number
  text: string
  created_at: string
  author_name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [comments, setComments] = useState<UserComment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        newPassword: "",
        confirmPassword: "",
      })
      loadUserComments()
    }
  }, [user])

  const loadUserComments = async () => {
    if (!user) return

    setLoadingComments(true)
    try {
      const { data, error: err } = await supabase
        .from("comments")
        .select("id, post_id, text, created_at, author_name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (err) throw err
      setComments(data || [])
    } catch (err) {
      console.error("Error loading comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setError("")
    setSuccess("")

    if (!formData.name || !formData.email) {
      setError("Name and email are required")
      return
    }

    setIsSaving(true)

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          email: formData.email,
        })
        .eq("id", user.id)

      if (profileError) {
        setError(profileError.message)
        setIsSaving(false)
        return
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("Passwords do not match")
          setIsSaving(false)
          return
        }

        if (formData.newPassword.length < 6) {
          setError("Password must be at least 6 characters")
          setIsSaving(false)
          return
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        })

        if (passwordError) {
          setError(passwordError.message)
          setIsSaving(false)
          return
        }

        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }))
      }

      setSuccess("Profile updated successfully!")
      setIsEditing(false)

      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    const file = e.target.files[0]

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const fileName = `${user.id}-${Date.now()}`
      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar: publicUrl })
        .eq("id", user.id)

      if (updateError) throw updateError

      setSuccess("Avatar updated successfully!")
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Failed to upload avatar")
      console.error("Upload error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-background flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon to-glow bg-clip-text text-transparent">
            My Profile
          </h1>
          <Button onClick={handleLogout} variant="outline" className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50">
            🚪 Logout
          </Button>
        </div>

        {success && (
          <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-accent/20 p-8 rounded-xl border border-border space-y-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-24 h-24 rounded-full border-2 border-neon object-cover"
              />
              <label className="text-xs text-neon hover:text-glow cursor-pointer transition-colors">
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password (optional)</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave empty to keep current password"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                      disabled={isSaving}
                    />
                  </div>

                  {formData.newPassword && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                        disabled={isSaving}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 bg-neon text-background hover:opacity-90"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user.name,
                          email: user.email,
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }}
                      variant="outline"
                      disabled={isSaving}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-foreground/60">Name</p>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <p className="text-lg font-semibold">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-neon text-background hover:opacity-90 w-full sm:w-auto"
                  >
                    ✏️ Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-accent/20 p-8 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-4">My Comments</h2>

          {loadingComments ? (
            <p className="text-foreground/60">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-foreground/60">You haven't left any comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-background p-4 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{comment.author_name}</p>
                    <p className="text-xs text-foreground/50">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-foreground/80">{comment.text}</p>
                  <Link
                    href={`/#blog`}
                    className="text-neon hover:text-glow text-sm mt-2 inline-block transition-colors"
                  >
                    View Post →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
