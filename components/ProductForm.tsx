import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Category, Product, Subcategory, useInventory } from "../context/InventoryContext";

type Props = {
  product?: Product | null;
};

export default function ProductForm({ product }: Props) {
  const { categories, subcategories, upsertProduct } = useInventory();
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "0");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [selectedSubs, setSelectedSubs] = useState<string[]>(product?.subcategoryIds ?? []);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => groupSubcategories(categories, subcategories), [categories, subcategories]);

  const toggleSub = (id: string) => {
    setSelectedSubs((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required");
    if (!sku.trim()) return setError("SKU is required");
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) return setError("Price must be 0 or more");
    const stockNum = Number(stock);
    if (Number.isNaN(stockNum) || stockNum < 0) return setError("Stock must be 0 or more");

    const saved = upsertProduct({
      id: product?.id,
      name,
      sku,
      price: priceNum,
      stock: stockNum,
      subcategoryIds: selectedSubs,
    });

    if (!saved) {
      setError("Could not save product");
      return;
    }
    router.push("/inventory").catch(() => {});
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
          <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
          <input type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Categories / Subcategories</label>
        {grouped.length === 0 ? (
          <p className="text-sm text-gray-500">Add a category first.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {grouped.map((group) => (
              <div key={group.category.id} className="rounded border p-3">
                <p className="mb-2 font-semibold text-gray-800">{group.category.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.subcategories.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1 text-sm">
                      <input type="checkbox" checked={selectedSubs.includes(s.id)} onChange={() => toggleSub(s.id)} />
                      {s.name}
                    </label>
                  ))}
                  {group.subcategories.length === 0 && (
                    <span className="text-xs text-gray-500">No subcategories yet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          onClick={() => router.push("/inventory").catch(() => {})}
        >
          Cancel
        </button>
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          {product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

function groupSubcategories(categories: Category[], subcategories: Subcategory[]) {
  return categories.map((category) => ({
    category,
    subcategories: subcategories.filter((s) => s.categoryId === category.id),
  }));
}

