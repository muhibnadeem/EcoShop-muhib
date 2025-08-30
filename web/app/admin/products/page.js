'use client';
import { useEffect, useState } from 'react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', categoryId: ''});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/products').then(r => r.json()).then(setProducts);
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  const save = async () => {
    const payload = { ...form, price: Number(form.price), categoryId: Number(form.categoryId) };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
    if (res.ok) location.reload(); else alert('Failed');
  };

  const del = async (id) => {
    if (!confirm('Delete product?')) return;
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/products/' + id, { method: 'DELETE', credentials: 'include' });
    if (res.ok) location.reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <div className="card p-4 mb-6 grid md:grid-cols-2 gap-4">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input className="input" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <input className="input md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
        <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <select className="input" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn" onClick={save}>Add Product</button>
      </div>

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="card p-4 flex items-center gap-4">
            <img src={p.imageUrl} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-slate-400">${Number(p.price).toFixed(2)}</div>
            </div>
            <button className="btn bg-red-500 hover:bg-red-400" onClick={() => del(p.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
