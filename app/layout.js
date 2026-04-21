// app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css";

// Configure Poppins with required weights and subsets
const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Add any weights you need
  subsets: ["latin"],
  variable: "--font-poppins", // CSS variable name
  display: "swap",
});

export const metadata = {
  title: "Grocery Inventory Management",
  description: "Complete inventory and POS system for grocery shops",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
