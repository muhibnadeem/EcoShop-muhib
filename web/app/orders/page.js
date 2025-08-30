'use client';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/orders/me', { credentials: 'include' }).then(r => r.json()).then(setOrders);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="grid gap-4">
        {orders.map(o => (
          <div key={o.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-sm text-slate-400">{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm mt-2">Status: <span className="font-semibold">{o.status}</span></div>
            <div className="mt-3 grid gap-2">
              {o.items.map(it => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>{it.product.name} × {it.quantity}</div>
                  <div>${Number(it.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right font-bold">Total: ${Number(o.total).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
