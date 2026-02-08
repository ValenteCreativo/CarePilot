import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePilot - AI Care Assistant for WhatsApp",
  description:
    "CarePilot helps caregivers manage care with WhatsApp-based scheduling, medication reminders, and appointments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased min-h-screen bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
