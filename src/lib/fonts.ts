import { Inter, JetBrains_Mono } from "next/font/google";

// Optimize font loading by only including weights we actually use
export const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: 'swap', // Improve font loading performance
});

// Match the configuration in layout.tsx
export const jet_brain_mono = JetBrains_Mono({
    variable: "--font-jetbrainsMono",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: 'swap', // Improve font loading performance
});

export const fontsVariable = {
    inter: inter.variable,
    jetBrainsMono: jet_brain_mono.variable
};