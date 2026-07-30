import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "ViVoo – Live Events & Cashless Arena Platform",
  description: "Discover live events, buy tickets, and experience real atmosphere",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-general"
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-general">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}

