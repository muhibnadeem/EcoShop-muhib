'use client';
import { useEffect, useState } from 'react';
import { API } from '../../../utils/api';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!params?.id) return;
    API.get(`/products/${params.id}`).then(r => setProduct(r.data));
  }, [params?.id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(i => i.productId === product.id);
    if (existing) existing.quantity += 1; else cart.push({ productId: product.id, name: product.name, price: Number(product.price), imageUrl: product.imageUrl, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart');
  };

  if (!product) return <div>Loading...</div>;
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <img src={product.imageUrl} className="rounded-2xl w-full object-cover" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-slate-300 mt-3">{product.description}</p>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-3xl font-extrabold">${Number(product.price).toFixed(2)}</span>
          <button className="btn" onClick={addToCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
