"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminNewsletter() {
  const router = useRouter()

  const [postTitle, setPostTitle] = useState('')
  const [postExcerpt, setPostExcerpt] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')

  // ✅ Состояние загрузки проверки авторизации
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token !== 'admin-token') {
      router.replace('/admin/login')
    } else {
      setAuthorized(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.replace('/admin/login')
  }

  const handleSend = async () => {
    if (!postTitle || !postExcerpt || !postUrl) {
      alert('Please fill all fields')
      return
    }

    setSending(true)
    setResult('')

    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ postTitle, postExcerpt, postUrl }),
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))

      if (response.ok) {
        alert('✅ Newsletter sent successfully!')
        setPostTitle('')
        setPostExcerpt('')
        setPostUrl('')
      }
    } catch (error) {
      console.error('Send error:', error)
      setResult(`Error: ${error}`)
    } finally {
      setSending(false)
    }
  }

  // ✅ Пока проверяем авторизацию — ничего не рендерим
  if (!authorized) return null

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon to-glow bg-clip-text text-transparent">
            📧 Send Newsletter
          </h1>
          <Button onClick={handleLogout} variant="outline">
            🚪 Logout
          </Button>
        </div>

        <div className="space-y-4 bg-accent/20 p-6 rounded-xl border border-border">
          <div>
            <label className="block font-semibold mb-2">Post Title</label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="My Amazing New Post"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Excerpt (Preview)</label>
            <textarea
              value={postExcerpt}
              onChange={(e) => setPostExcerpt(e.target.value)}
              placeholder="A short description of what this post is about..."
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Post URL</label>
            <input
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://yourblog.com/posts/my-post"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-neon"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-neon text-background hover:opacity-90 font-bold py-6 text-lg"
          >
            {sending ? '📤 Sending...' : '✉️ Send to All Subscribers'}
          </Button>
        </div>

        {result && (
          <div className="bg-accent/20 p-6 rounded-xl border border-border">
            <h3 className="font-bold mb-2">Result:</h3>
            <pre className="text-xs overflow-auto bg-background p-4 rounded">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-sm">
          <p className="font-bold mb-2">💡 How to use:</p>
          <ol className="list-decimal list-inside space-y-1 text-foreground/70">
            <li>Write a new blog post</li>
            <li>Fill in the title, excerpt, and URL above</li>
            <li>Click "Send to All Subscribers"</li>
            <li>All subscribers will receive an email notification!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
