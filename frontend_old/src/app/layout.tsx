import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedBackground from "../components/AnimatedBackground";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CursorEffect from "../components/CursorEffect";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rakshak AI - Enterprise Phishing Detection",
  description: "Modern AI-powered phishing detection for URLs and Emails. Instant risk assessment with explainable AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen w-screen bg-background text-foreground relative overflow-x-hidden antialiased selection:bg-primary-500/30 flex flex-col cursor-none`}>
        <CursorEffect />
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen flex-1">
          <Navbar />
          <main className="w-full flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
