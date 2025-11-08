"use client"

import { useI18n } from "@/context/i18n-context"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-foreground/5 border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🌸</div>
              <span className="font-heading font-bold text-xl">Yurie Jiyūbō</span>
            </div>
            <p className="text-foreground/70 text-sm">A dreamer living between pixels and stars</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="#about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </a>
              <a href="#blog" className="text-foreground/70 hover:text-foreground transition-colors">
                Blog
              </a>
              <a href="#gallery" className="text-foreground/70 hover:text-foreground transition-colors">
                Gallery
              </a>
              <a href="#support" className="text-foreground/70 hover:text-foreground transition-colors">
                Support
              </a>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">{t("footer.followMe")}</h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-125 transition-transform"
              >
                𝕏
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-125 transition-transform"
              >
                📷
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-125 transition-transform"
              >
                ▶️
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>{t("footer.copyright")} 💖</p>
        </div>
      </div>
    </footer>
  )
}
