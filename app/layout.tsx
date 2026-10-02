import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merhaba Ece Nehir",
  description: "Sana küçük bir sorum var.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fbf9f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="app-bg min-h-dvh font-sans text-espresso-800 antialiased">
        {children}
      </body>
    </html>
  );
}
