import Link from "next/link";
import PageShell from "../../components/PageShell";
import ProductList from "../../components/ProductList";
import PurchaseForm from "../../components/PurchaseForm";
import { useRequireAuth } from "../../context/AuthContext";
import { useInventory } from "../../context/InventoryContext";

export default function InventoryPage() {
  const { authReady, token } = useRequireAuth();
  const { products, categories, subcategories } = useInventory();

  if (!authReady || !token) {
    return null;
  }

  return (
    <PageShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-600">Manage your products and stock.</p>
        </div>
        <Link className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" href="/inventory/products/new">
          + New Product
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductList products={products} categories={categories} subcategories={subcategories} />
        </div>
        <PurchaseForm />
      </div>
    </PageShell>
  );
}

