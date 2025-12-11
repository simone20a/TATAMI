
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '',
  description: 'A visual IDE for a Domain Specific Language.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path fill=%22hsl(207 82% 68%)%22 d=%22M20,20h20v20h-20zM60,20h20v20h-20zM40,60h20v20h-20z%22/><path stroke=%22hsl(207 82% 68%)%22 stroke-width=%225%22 d=%22M30,40v20h20%22/></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
