import { FormEvent, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { useRequireAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext";

export default function PosPage() {
  const { authReady, token } = useRequireAuth();
  const { products, sell } = useInventory();

  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState("1");
  const [message, setMessage] = useState<string | null>(null);

  const selectedProduct = useMemo(() => products.find((p) => p.id === productId) ?? null, [products, productId]);

  if (!authReady || !token) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!productId) {
      setMessage("Select a product.");
      return;
    }
    const qtyNum = Number(qty);
    const result = sell(productId, qtyNum);
    if (!result.success) {
      setMessage(result.message ?? "Sale failed");
    } else {
      setMessage("Sale recorded");
    }
  };

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Point of Sale</h1>
        <p className="text-sm text-gray-600">Quick sell flow updates stock.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm max-w-xl">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" min="1" step="1" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        {selectedProduct && (
          <p className="text-sm text-gray-600">
            Price: ${selectedProduct.price.toFixed(2)} — Stock: {selectedProduct.stock}
          </p>
        )}
        {message && <p className="text-sm text-blue-700">{message}</p>}
        <div className="flex justify-end">
          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Sell
          </button>
        </div>
      </form>
    </PageShell>
  );
}

