import { ToastProvider } from '@/providers/ToastProvider';
import "@uploadthing/react/styles.css";
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/redux/Provider';
import Confit from '@/components/dashboard/Confit';



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Learning',
  description: 'LMS Platforme for learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
