"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login - in real app, check if user is authenticated
    router.push("/login")
  }, [router])

  return null
}
