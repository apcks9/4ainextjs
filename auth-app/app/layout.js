import { AuthProvider } from './providers/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'Auth App',
  description: 'Next.js authentication application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
