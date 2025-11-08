"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Blog from "@/components/blog"
import Gallery from "@/components/gallery"
import Support from "@/components/support"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Blog />
        <Gallery />
        <Support />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
