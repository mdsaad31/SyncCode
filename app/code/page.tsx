"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CodeWorkspace } from "@/components/synccode/code-workspace"

function CodePageInner() {
  const searchParams = useSearchParams()
  return <CodeWorkspace action={searchParams.get("action") ?? undefined} />
}

export default function CodePage() {
  return (
    <Suspense>
      <CodePageInner />
    </Suspense>
  )
}
