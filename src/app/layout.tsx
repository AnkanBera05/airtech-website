import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIRTECH — HVAC & MEP Engineering Consultancy | Kolkata",
  description:
    "Specialist MEP engineering consultancy delivering integrated, energy-efficient and sustainable HVAC, Fire Fighting, Plumbing, Electrical and BMS solutions across Eastern India.",
  keywords: [
    "HVAC Engineering Kolkata",
    "MEP Consultancy India",
    "Cleanroom Ventilation Design",
    "ASHRAE 170 Hospital HVAC",
    "Chilled Water Plant Optimization",
    "Fire Fighting Engineering NBC 2016",
    "BMS Automation",
  ],
  authors: [{ name: "AIRTECH Engineering Consultancy" }],
  creator: "AIRTECH",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://airtech-website-gules.vercel.app"),
  openGraph: {
    title: "AIRTECH — HVAC & MEP Engineering Consultancy",
    description: "Specialist MEP consultancy delivering integrated, efficient building services solutions.",
    url: "https://airtech-website-gules.vercel.app",
    siteName: "AIRTECH Engineering",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for LocalBusiness & Engineering Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EngineeringService",
    name: "AIRTECH HVAC & MEP Engineering Consultancy",
    url: "https://airtech-website-gules.vercel.app",
    logo: "https://airtech-website-gules.vercel.app/favicon.ico",
    description:
      "Independent technical consultancy delivering specialized HVAC, Cleanroom, Fire Fighting, Electrical, and BMS engineering design.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rajarhat Gopalpur",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700136",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "22.6247",
      longitude: "88.4601",
    },
    telephone: "+91-98363-44430",
    email: "info@airtech.in",
    taxID: "19AABCA1234F1Z5",
    knowsAbout: [
      "Heating, Ventilation, and Air Conditioning (HVAC)",
      "National Building Code of India (NBC 2016)",
      "ASHRAE Standards 90.1, 62.1 & 170",
      "Building Management Systems (BMS)",
    ],
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="h-full">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="min-h-full flex flex-col font-sans selection:bg-navy-900 selection:text-white">
          <PostHogProvider>
            {children}
            <CookieConsent />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
