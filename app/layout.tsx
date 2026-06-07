import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jōzō 揪作許願池",
  description: "讓想法被看見，讓對的人找到彼此",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
