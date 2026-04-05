import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import { AuthProvider } from "../contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "AICry Dashboard | The Synthetic Sentinel",
  description: "Advanced tactical AI interface for high-precision monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} font-sans tactical-grid min-h-screen`}
      >
        <AuthProvider>
          {children}
          <Toaster className="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
