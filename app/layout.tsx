import type { Metadata } from "next";
import '@/styles/globals.css'
import { Loader } from "@/components/ui/Loader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export const metadata: Metadata = {
  title: "DRIFTER PEAK — Built Different",
  description:
    "Not for everyone. Premium Gen-Z streetwear for those who drift above average.",
  keywords: ["streetwear", "premium", "drifter peak", "gen-z fashion", "drop"],
  openGraph: {
    title: "DRIFTER PEAK",
    description: "Drift above average.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grain">
        <Loader />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
