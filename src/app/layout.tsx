import type { Metadata } from "next";
import { Fredoka, Comfortaa } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NumberNinja - Aprende Matemáticas Divirtiéndote",
  description: "Juego educativo para que los niños aprendan matemáticas básicas y ganen recompensas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fredoka.variable} ${comfortaa.variable} antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
