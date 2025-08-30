export default function ProductCard({ product, addToCart }) {
  return (
    <div className="card p-4 flex flex-col">
      <img src={product.imageUrl} alt={product.name} className="rounded-xl h-48 w-full object-cover" />
      <div className="mt-4 flex-1">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-slate-400 text-sm line-clamp-2">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
        {addToCart && <button className="btn" onClick={() => addToCart(product)}>Add to cart</button>}
      </div>
    </div>
  );
}
