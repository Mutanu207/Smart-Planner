import type { Metadata } from "next";
import "./globals.css";
import { dmSans, playfair } from "@/ui/font";
import { AuthProvider }  from "@/context/AuthProvider"
import type { ReactNode } from "react";
import {NotificationProvider} from "@/context/NotificationProvider"

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Smart Planner",
  description: "A daily planner powered with AI that helps you plan your to-do according to your energy patterns",
};


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">  <AuthProvider> <NotificationProvider> {children} </NotificationProvider> </AuthProvider> </body>
    </html>
  );
}
