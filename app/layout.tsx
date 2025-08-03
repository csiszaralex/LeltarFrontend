import Header from "./components/Header";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/app/components/theme-provider";

export const metadata = {
  title: "Leltár alkalmazás",
  description: "Egyszerű belső leltárkezelő rendszer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-zinc-100 text-zinc-900",
          "dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="p-6 max-w-6xl mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
