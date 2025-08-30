'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => { API.get('/products').then(r => setProducts(r.data.slice(0,4))); }, []);
  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.productId === p.id);
    if (existing) existing.quantity += 1; else cart.push({ productId: p.id, name: p.name, price: Number(p.price), imageUrl: p.imageUrl, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  };
  return (
    <div>
      <section className="mb-10">
        <div className="card p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Shop smarter with <span className="text-cyan-400">EcoShop</span></h1>
          <p className="mt-3 text-slate-300">A sleek, modern storefront with secure Stripe checkout.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link className="btn" href="/products">Browse Products</Link>
            <Link className="btn bg-slate-800 text-white border border-slate-700 hover:bg-slate-700" href="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link className="text-slate-300 hover:text-white" href="/products">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
        </div>
      </section>
    </div>
  );
}
