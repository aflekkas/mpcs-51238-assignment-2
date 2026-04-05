import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WatchlistProvider } from "@/lib/watchlist-context";
import { Navbar } from "@/components/navbar";
import { SplashScreen } from "@/components/splash-screen";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-logo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CANTFINDAFLIX",
  description: "You'll never find anything to watch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <WatchlistProvider>
            <SplashScreen>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Toaster />
            </SplashScreen>
          </WatchlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
