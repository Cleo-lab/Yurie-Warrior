"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useI18n } from "@/context/i18n-context"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        try {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
          })

          if (profileError) {
            // Если ошибка "duplicate key" — профиль уже существует, просто переходим на verify
            if (profileError.message.includes("duplicate key")) {
              router.push("/verify-email")
              return
            }
            setError(profileError.message)
            setLoading(false)
            return
          }
        } catch (profileErr) {
          console.error("Profile creation error:", profileErr)
          // Все равно переходим на verify-email, т.к. регистрация в auth прошла успешно
          router.push("/verify-email")
          return
        }

        setSuccess(true)
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })

        // Перенаправить сразу, без задержки
        router.push("/verify-email")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Registration error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-md mx-auto">
        <div className="bg-accent/20 p-8 rounded-xl border border-border">
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-foreground/60 text-sm mb-6">Join our community and start your journey</p>

          {success && (
            <div className="bg-primary/20 border border-primary text-primary px-4 py-3 rounded-lg mb-4 text-sm">
              ✨ Registration successful! Check your email to verify your account.
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-neon transition-colors"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-neon text-background hover:opacity-90 font-bold py-2 rounded-lg"
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-foreground/60 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-neon hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
