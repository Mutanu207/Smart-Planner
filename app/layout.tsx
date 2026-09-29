import type { Metadata } from "next";
import "./globals.css";
import { dmSans, playfair } from "@/ui/font";

export const metadata: Metadata = {
  title: "Smart Planner",
  description: "A daily planner powered with AI that helps you plan your to-do according to your energy patterns",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
