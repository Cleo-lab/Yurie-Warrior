"use client"

import { useState } from "react"
import { useI18n } from "@/context/i18n-context"
import DonationModal from "@/components/donation-modal"

export default function Support() {
  const { t } = useI18n()
  const [openModal, setOpenModal] = useState<"BTC" | "ETH" | "MULTI" | null>(null)

  // TODO: Replace with actual wallet addresses
  const walletAddresses = {
    btc: "1A1z7agoat2NRrB6rk1nau9RenMg8h5kPo",
    eth: "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    multi: "bc1qw508d6qejxtdg4y5r3zarvaryv98gj9c7f05ua",
  }

  return (
    <section id="support" className="py-20 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-heading font-bold mb-4 text-center">{t("support.title")} ✨</h2>
        <p className="text-center text-foreground/70 mb-12 text-lg">{t("support.description")}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* BTC Support */}
          <div className="bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl p-8 text-center border border-border hover:border-neon hover:shadow-lg transition-all group">
            <div className="text-5xl mb-4">₿</div>
            <h3 className="font-bold text-xl mb-2">Bitcoin</h3>
            <p className="text-sm text-foreground/70 mb-6">Send BTC to support my creative journey</p>
            <button
              onClick={() => setOpenModal("BTC")}
              className="w-full px-6 py-3 bg-primary text-foreground rounded-lg font-semibold hover:shadow-md transition-all group-hover:scale-105"
            >
              {t("support.btcSupport")}
            </button>
          </div>

          {/* ETH Support */}
          <div className="bg-gradient-to-br from-secondary/30 to-accent/30 rounded-2xl p-8 text-center border border-border hover:border-neon hover:shadow-lg transition-all group">
            <div className="text-5xl mb-4">Ξ</div>
            <h3 className="font-bold text-xl mb-2">Ethereum</h3>
            <p className="text-sm text-foreground/70 mb-6">Send ETH or USDT on Ethereum network</p>
            <button
              onClick={() => setOpenModal("ETH")}
              className="w-full px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:shadow-md transition-all group-hover:scale-105"
            >
              {t("support.ethSupport")}
            </button>
          </div>

          {/* Crypto Support */}
          <div className="bg-gradient-to-br from-accent/30 to-primary/30 rounded-2xl p-8 text-center border border-border hover:border-neon hover:shadow-lg transition-all group">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="font-bold text-xl mb-2">Multi-Crypto</h3>
            <p className="text-sm text-foreground/70 mb-6">Support with multiple cryptocurrencies</p>
            <button
              onClick={() => setOpenModal("MULTI")}
              className="w-full px-6 py-3 bg-accent text-foreground rounded-lg font-semibold hover:shadow-md transition-all group-hover:scale-105"
            >
              {t("support.cryptoSupport")}
            </button>
          </div>
        </div>

        {/* Banner Area */}
        <div className="mt-16 p-8 bg-border/30 rounded-2xl border border-border text-center">
          <p className="text-foreground/70 text-sm">
            Cryptocurrency donations processed instantly. No intermediaries, pure support to creators.
          </p>
        </div>
      </div>

      <DonationModal
        isOpen={openModal === "BTC"}
        onClose={() => setOpenModal(null)}
        currency="BTC"
        address={walletAddresses.btc}
      />
      <DonationModal
        isOpen={openModal === "ETH"}
        onClose={() => setOpenModal(null)}
        currency="ETH"
        address={walletAddresses.eth}
      />
      <DonationModal
        isOpen={openModal === "MULTI"}
        onClose={() => setOpenModal(null)}
        currency="MULTI"
        address={walletAddresses.multi}
      />
    </section>
  )
}
