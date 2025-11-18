import "./globals.css";
import AppProvider from "@/context";
import { Poppins } from "next/font/google";
import ToasterProvider from "@/components/toast/ToasterProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Learning Management System",
  description: "Assignment project by orex technologies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="font-[Poppins]">
        <AppProvider>
          <ToasterProvider />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
