import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const spiderPfp = "https://cdn.discordapp.com/icons/1541030301336215562/4119cf6ca8318ba22c8882efb6e18505.webp?size=1024";

export const metadata: Metadata = {
  title: "Spider Studios",
  description: "Independent Roblox game studio.",
  icons: {
    icon: [{ url: spiderPfp, type: "image/webp" }],
    shortcut: spiderPfp,
    apple: spiderPfp,
  },
  openGraph: {
    title: "Spider Studios",
    description: "Independent Roblox game studio.",
    images: [{ url: spiderPfp }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
