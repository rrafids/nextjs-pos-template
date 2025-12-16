import { useState } from "react";
import PageShell from "../../components/PageShell";
import ProductList from "../../components/ProductList";
import PurchaseForm from "../../components/PurchaseForm";
import ProductForm from "../../components/ProductForm";
import { useRequireAuth } from "../../context/AuthContext";
import { useInventory } from "../../context/InventoryContext";

export default function ProductsPage() {
  const { authReady, token } = useRequireAuth();
  const { products, categories, subcategories } = useInventory();
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  if (!authReady || !token) {
    return null;
  }

  return (
    <PageShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your products, categories, and stock.</p>
        </div>
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700"
          onClick={() => setShowNewProductModal(true)}
        >
          + New Product
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductList products={products} categories={categories} subcategories={subcategories} />
        </div>
        <PurchaseForm />
      </div>

      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowNewProductModal(false)}>
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">New Product</h2>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => setShowNewProductModal(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <ProductForm onSuccess={() => setShowNewProductModal(false)} />
          </div>
        </div>
      )}
    </PageShell>
  );
}

