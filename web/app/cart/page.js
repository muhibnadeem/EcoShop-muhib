'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateQty = (id, q) => {
    const next = cart.map(i => i.productId === id ? { ...i, quantity: Math.max(1, q) } : i);
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };
  const removeItem = (id) => {
    const next = cart.filter(i => i.productId !== id);
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      <div className="grid gap-4">
        {cart.map(i => (
          <div key={i.productId} className="card p-4 flex items-center gap-4">
            <img src={i.imageUrl} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="font-semibold">{i.name}</div>
              <div className="text-slate-400">${i.price.toFixed(2)}</div>
            </div>
            <input type="number" className="input w-24" value={i.quantity} onChange={e => updateQty(i.productId, parseInt(e.target.value || '1', 10))} />
            <button className="btn bg-red-500 hover:bg-red-400" onClick={() => removeItem(i.productId)}>Remove</button>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl">Total: <span className="font-bold">${total.toFixed(2)}</span></div>
          <Link className="btn" href="/checkout">Proceed to Checkout</Link>
        </div>
      )}
    </div>
  );
}
