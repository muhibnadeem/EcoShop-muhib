'use client';
import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import ProductCard from '../../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/products').then(r => setProducts(r.data));
    API.get('/categories').then(r => setCategories(r.data));
  }, []);

  const filtered = filter === 'all' ? products : products.filter(p => p.category?.slug === filter);

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.productId === p.id);
    if (existing) existing.quantity += 1; else cart.push({ productId: p.id, name: p.name, price: Number(p.price), imageUrl: p.imageUrl, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <select className="input max-w-xs" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} />)}
      </div>
    </div>
  );
}
