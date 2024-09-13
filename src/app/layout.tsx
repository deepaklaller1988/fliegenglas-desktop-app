import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutPath from "../components/LayoutPath";
import Provider from "../components/core/Provider";
import ToastProvider from "@components/core/ToasterProvider";
import AudioPlayer from "@components/AudioPlayer";
// import { AudioPlayerProvider } from "context/AudioPlayerContext";
import { NetworkProvider } from "context/NetworkContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fliegenglas",
  description: "Generated by create next app",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NetworkProvider>
          <Provider>
            {/* <AudioPlayerProvider> */}
            <div className="w-full">
              <LayoutPath>{children}</LayoutPath>
              <ToastProvider />
            </div>
            <AudioPlayer />
            {/* </AudioPlayerProvider> */}
          </Provider>
        </NetworkProvider>
      </body>
    </html>
  );
}
