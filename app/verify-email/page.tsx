"use client"

import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-background">
      <div className="max-w-md mx-auto">
        <div className="bg-accent/20 p-8 rounded-xl border border-border text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
          <p className="text-foreground/70 mb-6">
            We've sent you a confirmation link to verify your email address. Please check your inbox and click the link to complete your registration.
          </p>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 text-sm text-left">
            <p className="font-semibold mb-2">Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/70">
              <li>Check your spam folder if you don't see the email</li>
              <li>The link will expire in 24 hours</li>
              <li>After verifying, you can sign in to your account</li>
            </ul>
          </div>

          <Link href="/login" className="inline-block px-6 py-2 bg-neon text-background font-bold rounded-lg hover:opacity-90 transition-opacity">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
