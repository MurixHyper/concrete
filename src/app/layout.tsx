import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MiniCart } from "@/components/MiniCart";

export const metadata: Metadata = {
  title: {
    default: "Concrete — Heavyweight streetwear",
    template: "%s — Concrete",
  },
  description:
    "Concrete is a concept streetwear store: heavyweight hoodies and crewnecks in limited drops. Portfolio project — no real orders are taken.",
};

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <MiniCart />
        </StoreProvider>
      </body>
    </html>
  );
}
