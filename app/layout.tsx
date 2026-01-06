import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { Header } from "@/components/layout/header"

// Optional: set a default font & className for Tailwind
const bodyClass = "bg-gray-50 text-gray-900 antialiased min-h-screen"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>SurplusConnect</title>
        <meta
          name="description"
          content="Smart platform to redistribute surplus food from events to those in need"
        />
      </head>
      <body className={bodyClass} suppressHydrationWarning>
        {/* Header / Navbar */}
        <Header />

        {/* Main Content */}
        <main className="flex flex-col items-center justify-start w-full flex-1 px-4 py-6">
          {children}
        </main>

        {/* Global Toast / Notifications */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  )
}
