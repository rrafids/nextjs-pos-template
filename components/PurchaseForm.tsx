import { FormEvent, useState } from "react";
import { useInventory } from "../context/InventoryContext";

export default function PurchaseForm() {
  const { products, purchase } = useInventory();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState("1");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!productId) {
      setMessage("Select a product.");
      return;
    }
    const qtyNum = Number(qty);
    const result = purchase(productId, qtyNum);
    if (!result.success) {
      setMessage(result.message ?? "Purchase failed");
    } else {
      setMessage("Stock increased");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Purchase</h2>
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
      {message && <p className="text-sm text-blue-700">{message}</p>}
      <div className="flex justify-end">
        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Add Stock
        </button>
      </div>
    </form>
  );
}

