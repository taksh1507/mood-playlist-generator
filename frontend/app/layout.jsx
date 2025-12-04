import './globals.css';

export const metadata = {
  title: 'Music-based Mood DJ',
  description: 'Upload music and generate AI-powered playlists based on your mood',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
