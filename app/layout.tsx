import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Музыка для лифта",
  description: "Presave experience",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
