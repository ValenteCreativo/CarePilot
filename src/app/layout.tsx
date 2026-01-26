import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePilot - Caregiver's Command Center",
  description: "Turn care into a plan. A practical tool for caregivers managing complex care situations.",
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
