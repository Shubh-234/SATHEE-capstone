import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Suspense } from "react";
import Loading from "./loading";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Sathee",
  description: "Sathee",
};

export const fetchCache = 'force-no-store';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Head>
          <link rel="icon" href="/assets/Logo.ico" />
        </Head>
        <Suspense fallback={<Loading />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
