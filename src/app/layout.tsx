import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono } from "next/font/google";
import "./globals.css";
import { registerServiceWorker } from "@/lib/register-sw";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Copa Family",
  description:
    "Crie uma sala, chame a família e descubra quem manda na Copa.",
  applicationName: "Copa Family",
  appleWebApp: {
    capable: true,
    title: "Copa Family",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="stadium"
      className={`${archivo.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col pb-[env(safe-area-inset-bottom)]">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(${registerServiceWorker.toString()})()`,
          }}
        />
      </body>
    </html>
  );
}
