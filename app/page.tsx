import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import HomeClient from "@/components/home-client"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <HomeClient />
      </Suspense>
    </ErrorBoundary>
  )
}
