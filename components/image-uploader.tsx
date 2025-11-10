"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface ImageUploaderProps {
  onImageUrl: (url: string) => void
  bucket?: string
}

export default function ImageUploader({ onImageUrl, bucket = "blog-images" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setUploading(true)
      setProgress(0)

      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `${bucket}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onImageUrl(publicUrl)
      setProgress(100)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="image-uploader space-y-3">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="px-4 py-3 border-2 border-dashed border-border rounded-lg text-center hover:border-neon transition-colors cursor-pointer">
          {uploading ? (
            <div>
              <p className="text-sm font-medium mb-2">Uploading... {progress}%</p>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-neon h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-foreground/60">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
