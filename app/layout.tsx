import type React from "react"
import type { Metadata } from "next"
import { Poppins, Nunito } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Yuri's Dream Journal",
  description: "A cozy anime-inspired digital blog full of dreams, art, and thoughts.",
  keywords: "anime, vtuber, cozy, blog, aesthetic, digital girl, neo-tokyo",
  openGraph: {
    title: "Yuri's Dream Journal",
    description: "A cozy anime-inspired digital blog full of dreams, art, and thoughts.",
    type: "website",
    url: "https://yuri-blog.com",
    images: [
      {
        url: "https://yuri-blog.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yuri's Dream Journal",
    description: "A cozy anime-inspired digital blog full of dreams, art, and thoughts.",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${poppins.variable} ${nunito.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
