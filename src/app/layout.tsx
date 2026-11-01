import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIRTECH — HVAC & MEP Engineering Consultancy | Kolkata",
  description: "Specialized mechanical, electrical, plumbing, fire protection, and building management system engineering consultancy for hospitals, commercial IT towers, cleanrooms, and industrial projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans selection:bg-navy-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
