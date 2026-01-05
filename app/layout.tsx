import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { Header } from "@/components/layout/header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Header />
                {children}
                <Toaster />
            </body>
        </html>
    );
}
