'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

function Stat({ label, value }) {
  return (
    <div className="card p-4">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-3xl font-extrabold">{value}</div>
    </div>
  );
}

export default function Admin() {
  const [stats, setStats] = useState({ products: 0, revenue: 0, orders: 0, users: 0 });
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/admin/stats', { credentials: 'include' })
      .then(r => r.json())
      .then(setStats);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link className="btn" href="/admin/products">Products</Link>
          <Link className="btn" href="/admin/categories">Categories</Link>
          <Link className="btn" href="/admin/orders">Orders</Link>
          <Link className="btn" href="/admin/users">Users</Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Products" value={stats.products} />
        <Stat label="Revenue" value={"$" + Number(stats.revenue).toFixed(2)} />
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Users" value={stats.users} />
      </div>
    </div>
  );
}
