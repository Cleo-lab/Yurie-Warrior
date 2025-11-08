"use client"

import { useState } from "react"
import { useI18n } from "@/context/i18n-context"
import { Button } from "@/components/ui/button"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  currency: "BTC" | "ETH" | "MULTI"
  address?: string
}

export default function DonationModal({
  isOpen,
  onClose,
  currency,
  address = "Please add your wallet address",
}: DonationModalProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (address && address !== "Please add your wallet address") {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getCurrencyInfo = () => {
    switch (currency) {
      case "BTC":
        return {
          title: "Bitcoin Donation",
          emoji: "₿",
          description: "Send Bitcoin to support my creative work",
          networks: ["Bitcoin Network"],
        }
      case "ETH":
        return {
          title: "Ethereum Donation",
          emoji: "Ξ",
          description: "Send ETH or USDT on Ethereum network",
          networks: ["Ethereum Network", "Polygon (MATIC)"],
        }
      case "MULTI":
        return {
          title: "Multi-Crypto Donation",
          emoji: "💎",
          description: "Support with various cryptocurrencies",
          networks: ["Bitcoin", "Ethereum", "BNB Chain", "Polygon", "Solana"],
        }
      default:
        return {
          title: "Donation",
          emoji: "💝",
          description: "Support my creative journey",
          networks: [],
        }
    }
  }

  const info = getCurrencyInfo()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl max-w-md w-full border border-border overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.emoji}</span>
            <h2 className="text-xl font-bold">{info.title}</h2>
          </div>
          <button onClick={onClose} className="text-2xl hover:opacity-60 transition-opacity">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-foreground/70 text-sm">{info.description}</p>

          {/* Address Display */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground/80">Wallet Address:</label>
            <div className="bg-accent/20 border border-border rounded-lg p-4 font-mono text-sm break-all">
              {address}
            </div>
            <button
              onClick={handleCopy}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                copied
                  ? "bg-green-500/20 text-green-600 border border-green-500/30"
                  : "bg-neon text-background hover:opacity-90"
              }`}
            >
              {copied ? "Copied!" : "Copy Address"}
            </button>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-border/50 rounded-lg flex items-center justify-center text-foreground/50 border border-border">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-xs">QR Code</p>
              </div>
            </div>
          </div>

          {/* Networks */}
          {info.networks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground/60">Supported Networks:</p>
              <div className="flex flex-wrap gap-2">
                {info.networks.map((network) => (
                  <span key={network} className="px-3 py-1 text-xs bg-primary/20 border border-primary/30 rounded-full">
                    {network}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-xs text-foreground/70">
            <p className="font-semibold mb-1">Thank you for supporting my dreams!</p>
            <p>Every contribution helps me create more amazing content. Your support means the world to me.</p>
          </div>

          <Button onClick={onClose} className="w-full bg-accent text-background hover:opacity-90">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
