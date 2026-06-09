import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jōzō 揪作許願池",
  description: "有想做的事？找對的人，一起揪作",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased" suppressHydrationWarning>
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-50`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
