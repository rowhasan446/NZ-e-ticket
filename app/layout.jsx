import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["400", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "নজরুল উৎসব ২০২৬ | বাংলাদেশ নজরুল সংগীত সংস্থা (BNSS)",
  description: "বাংলাদেশ নজরুল সংগীত সংস্থা আয়োজিত দুই দিনব্যাপী 'নজরুল উৎসব ২০২৬' এর অফিসিয়াল নিবন্ধন প্ল্যাটফর্ম। প্রতিপাদ্য: 'চির উন্নত মম শির'।",
  keywords: ["নজরুল উৎসব", "নজরুল সংগীত", "BNSS", "বাংলাদেশ নজরুল সংগীত সংস্থা", "কাজী নজরুল ইসলাম", "নিবন্ধন"],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700;900&family=Tiro+Bangla&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-bg text-brand-dark antialiased selection:bg-brand-rust selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
