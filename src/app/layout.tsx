import React from 'react';
import './globals.css';
import { Metadata } from 'next';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="scroll-progress" id="scrollProgress"></div>
        {children}
      </body>
    </html>
  );
}
