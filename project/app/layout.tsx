
import { Inter } from 'next/font/google'
import AuthProvider from './context/AuthProvider'
import '@/app/globals.css';
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getSession } from "@/app/session"
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TrustNGo',
  description: 'AI Generated crontracts for escrow based transaction',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  return (
    <html lang="en">
      <body className={inter.className}>
      <SidebarProvider>
      <AppSidebar session={session} />
        <AuthProvider>
          <main className="w-full mx-auto p-6 ">
           <SidebarTrigger />
           <Toaster />
            {children}
          </main>
        </AuthProvider>
      </SidebarProvider>
      </body>
    </html>
  )
}
