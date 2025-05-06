import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Updated import
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster for notifications

const inter = Inter({ // Use Inter
  variable: '--font-inter', // Updated CSS variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CodeCrafter - FiveM Script Generator',
  description: 'AI-powered FiveM script generation by CodeCrafter',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}> {/* Apply font variable to html tag */}
      <body className="antialiased font-sans"> {/* Use font-sans Tailwind utility */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
