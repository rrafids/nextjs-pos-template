import { FormEvent, useState } from "react";
import { useInventory } from "../context/InventoryContext";

export default function CategoryManager() {
  const { categories, subcategories, addCategory, addSubcategory } = useInventory();
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const created = addCategory(categoryName);
    if (!created) {
      setError("Category name is required or already exists.");
      return;
    }
    setCategoryName("");
    if (!selectedCategory) setSelectedCategory(created.id);
  };

  const handleSubcategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedCategory) {
      setError("Select a category first.");
      return;
    }
    const created = addSubcategory(subcategoryName, selectedCategory);
    if (!created) {
      setError("Subcategory name is required or already exists for this category.");
      return;
    }
    setSubcategoryName("");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Add Category</h2>
        <form onSubmit={handleCategorySubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category name</label>
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Beverages" />
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700">
            Create
          </button>
        </form>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Add Subcategory</h2>
        <form onSubmit={handleSubcategorySubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Subcategory name</label>
            <input
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="e.g. Soda"
            />
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700">
            Create
          </button>
        </form>
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <section className="card md:col-span-2">
        <h3 className="text-lg font-semibold text-slate-900">Existing Categories</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-500">No categories yet.</p>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subcategories.filter((s) => s.categoryId === c.id).map((s) => (
                    <span key={s.id} className="rounded bg-white px-2 py-1 text-xs text-slate-700 shadow-sm ring-1 ring-slate-200">
                      {s.name}
                    </span>
                  ))}
                  {subcategories.filter((s) => s.categoryId === c.id).length === 0 && (
                    <span className="text-xs text-slate-500">No subcategories</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

