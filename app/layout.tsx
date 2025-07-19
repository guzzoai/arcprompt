import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Prompt Database - 170+ ChatGPT & Claude Prompts | Save 5+ Hours Weekly",
  description: "Unlock AI's full potential with our curated database of 170+ expert prompts. Get 10x better outputs from ChatGPT, Claude & Gemini. Join 10,000+ users. Try free!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
