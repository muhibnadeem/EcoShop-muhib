'use client';
import { API } from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const createCheckout = async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const items = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));
    // Create a dummy local "order" before redirecting
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/orders/prepare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ items }) });
    if (!res.ok) {
      alert('Please log in before checkout.');
      return;
    }
    const prep = await res.json();
    const r = await API.post('/checkout/create-session', { items });
    if (r.data.url) {
      // Save mapping to payment session
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/orders/attach-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ orderId: prep.orderId, sessionId: r.data.id }) });
      window.location.href = r.data.url;
    }
  };

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-slate-300 mb-6">You will be redirected to Stripe to complete payment.</p>
      <button className="btn" onClick={createCheckout}>Pay with Stripe</button>
    </div>
  );
}
