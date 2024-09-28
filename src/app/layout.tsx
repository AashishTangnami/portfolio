import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jet_brain_mono = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ["100","200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetbrainsMono",
});

export const metadata: Metadata = {
  title: "Aashish Tangnami",
  description: "Aashish Tangnami's professional website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth min-h-[75vh] mx-auto px-8 py-12 max-w-7xl">
      <body className={jet_brain_mono.variable}>
        {/* <Header/> */}
        {children}
        {/* <Footer/> */}
        </body>
    </html>
    
  );
}
