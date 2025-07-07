import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added for potential future use, good practice

export const metadata: Metadata = {
  title: 'Luminous Clicks',
  description: 'Interactive particle animations on click.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> {/* Apply dark theme by default */}
      <body className="font-body antialiased">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Removed Inter, replaced with Space Grotesk */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        {children}
        <Toaster /> {/* Toaster for any notifications, though not explicitly used by core features */}
      </body>
    </html>
  );
}
