
import { Inter } from 'next/font/google'
import AuthProvider from './context/AuthProvider'
import '@/app/globals.css';
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TrustNGo',
  description: 'AI Generated crontracts for escrow based transaction',
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
          <main className="w-full mx-auto p-6 ">
           <Toaster />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
