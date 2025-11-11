"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useI18n } from "@/context/i18n-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface Comment {
  id: string
  author_name: string
  author_email: string
  author_avatar: string | null
  text: string
  created_at: string
  post_id: number
  parent_comment_id: string | null
}

export default function Comments({ postId }: { postId: number }) {
  const { t } = useI18n()
  const { user, isLoggedIn } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Загрузка комментариев из Supabase
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent, parentCommentId: string | null = null) => {
    e.preventDefault()
    if (!isLoggedIn || !user || !newComment.trim()) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_name: user.name,
          author_email: user.email,
          author_avatar: user.avatar || null,
          text: newComment.trim(),
          parent_comment_id: parentCommentId,
        })
        .select()
        .single()

      if (error) throw error

      setComments([data as Comment, ...comments])
      setNewComment("")
      setReplyingTo(null)
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to post comment. Please try again.')
    }
  }

  if (loading) {
    return <div className="mt-8 pt-8 border-t border-border">Loading comments...</div>
  }

  const parentComments = comments.filter((c) => !c.parent_comment_id)

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="font-bold mb-6 text-lg">{t("comments.title")}</h3>

      {isLoggedIn && user ? (
        <form onSubmit={(e) => handleAddComment(e, null)} className="mb-8 space-y-4">
          <div className="flex gap-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-border"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm">{user.name}</p>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("comments.placeholder")}
                className="w-full mt-2 p-3 bg-accent/20 border border-border rounded-lg focus:outline-none focus:border-neon transition-colors resize-none"
                rows={3}
              />
              <Button
                type="submit"
                disabled={!newComment.trim()}
                className="mt-3 bg-neon text-background hover:opacity-90"
              >
                {t("comments.post")}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded-lg text-sm text-foreground/70">
          {t("comments.loginRequired")}
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-foreground/60 text-sm">{t("comments.noComments")}</p>
        ) : (
          parentComments.map((parentComment) => {
            const replies = comments.filter((c) => c.parent_comment_id === parentComment.id)
            return (
              <div key={parentComment.id} className="comment-thread">
                {/* Parent Comment */}
                <div className="flex gap-4 pb-4">
                  <img
                    src={parentComment.author_avatar || "/placeholder.svg"}
                    alt={parentComment.author_name}
                    className="w-8 h-8 rounded-full border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-semibold text-sm">{parentComment.author_name}</p>
                      <time className="text-xs text-foreground/50">
                        {new Date(parentComment.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <p className="text-sm text-foreground/70 mt-2">{parentComment.text}</p>
                    <button
                      onClick={() =>
                        setReplyingTo(replyingTo === parentComment.id ? null : parentComment.id)
                      }
                      className="mt-2 text-xs text-neon hover:opacity-70 font-medium"
                    >
                      {replyingTo === parentComment.id ? "Cancel" : "Reply"}
                    </button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === parentComment.id && isLoggedIn && user && (
                  <form
                    onSubmit={(e) => handleAddComment(e, parentComment.id)}
                    className="ml-12 mb-4 space-y-3 pt-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border border-border flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a reply..."
                          className="w-full p-2 bg-accent/20 border border-border rounded-lg focus:outline-none focus:border-neon transition-colors resize-none text-sm"
                          rows={2}
                          autoFocus
                        />
                        <Button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="mt-2 text-sm bg-neon text-background hover:opacity-90 h-8"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-12 space-y-4 pt-4 border-l-2 border-border/50 pl-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
                        <img
                          src={reply.author_avatar || "/placeholder.svg"}
                          alt={reply.author_name}
                          className="w-7 h-7 rounded-full border border-border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="font-semibold text-sm">{reply.author_name}</p>
                            <time className="text-xs text-foreground/50">
                              {new Date(reply.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                          </div>
                          <p className="text-sm text-foreground/70 mt-1">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-b border-border/50 mt-4" />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
