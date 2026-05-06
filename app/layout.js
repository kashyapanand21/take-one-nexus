import './globals.css';
import CustomCursor from '../components/CustomCursor';

export const metadata = {
  title: 'TAKE ONE | Film Crew & Script Collaboration',
  description: 'The ultimate platform for film professionals to collaborate on scripts and crew management.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
