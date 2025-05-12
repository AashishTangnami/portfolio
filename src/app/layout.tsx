import type { Metadata, Viewport } from "next";
import "./globals.css";
import { jet_brain_mono, inter } from "@/lib/fonts";
import { PreloadResources } from "@/components/PreloadResources";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

// Enhanced metadata for better SEO
export const metadata: Metadata = {
  title: {
    template: '%s | Aashish Tangnami',
    default: 'Aashish Tangnami - Data Professional & Software Engineer',
  },
  description: "Aashish Tangnami is a data professional specializing in AI and software engineering, committed to delivering high-quality solutions and driving innovation.",
  keywords: ["Aashish Tangnami", "Data Engineer", "Software Engineer", "AI", "Portfolio", "Developer"],
  authors: [{ name: "Aashish Tangnami", url: "https://github.com/AashishTangnami" }],
  creator: "Aashish Tangnami",
  publisher: "Aashish Tangnami",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aashishtangnami.com",
    title: "Aashish Tangnami - Data Professional & Software Engineer",
    description: "Aashish Tangnami is a data professional specializing in AI and software engineering, committed to delivering high-quality solutions and driving innovation.",
    siteName: "Aashish Tangnami Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Aashish Tangnami Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashish Tangnami - Data Professional & Software Engineer",
    description: "Aashish Tangnami is a data professional specializing in AI and software engineering, committed to delivering high-quality solutions and driving innovation.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Viewport configuration for better mobile experience
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f3f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1B2021' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <PreloadResources />
      </head>
      <body className={`${jet_brain_mono.variable} ${inter.variable} font-primary min-h-screen flex flex-col`}>
        <ThemeProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
