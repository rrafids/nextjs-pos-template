import Link from "next/link";
import { Product, Subcategory, Category } from "../context/InventoryContext";

type Props = {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
};

export default function ProductList({ products, categories, subcategories }: Props) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const subMap = new Map(subcategories.map((s) => [s.id, s]));

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">SKU</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">Price</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">Stock</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">Categories</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-center text-slate-500" colSpan={6}>
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                <td className="px-4 py-3 text-slate-700">{p.sku}</td>
                <td className="px-4 py-3 text-slate-700">Rp {p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-700">{p.stock}</td>
                <td className="px-4 py-3 text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {p.subcategoryIds.map((id) => {
                      const sub = subMap.get(id);
                      if (!sub) return null;
                      const catName = categoryMap.get(sub.categoryId) ?? "Unassigned";
                      return (
                        <span key={id} className="rounded bg-indigo-50 px-2 py-1 text-xs text-indigo-700 ring-1 ring-indigo-100">
                          {catName} / {sub.name}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/products/${p.id}`} className="text-indigo-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

