export const metadata = {
  title: 'EcoShop',
  description: 'Modern e-commerce built with Next.js + Stripe',
};
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span> EcoShop
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-300">
              <Link href="/products">Products</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/orders">My Orders</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="border-t border-slate-800">
          <div className="container py-8 text-sm text-slate-400">
            © {new Date().getFullYear()} EcoShop. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
