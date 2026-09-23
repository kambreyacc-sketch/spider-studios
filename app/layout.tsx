import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata={
  title:"Spider Studios",
  description:"Independent Roblox game studio.",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
