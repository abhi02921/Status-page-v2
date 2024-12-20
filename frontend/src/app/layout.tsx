// /app/layout.tsx

import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/" dynamic>
      <html lang="en">
        <body className="min-h-screen bg-gray-50">

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
