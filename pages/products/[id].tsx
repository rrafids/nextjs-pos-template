import { useRouter } from "next/router";
import Link from "next/link";
import PageShell from "../../../components/PageShell";
import ProductForm from "../../../components/ProductForm";
import { useRequireAuth } from "../../../context/AuthContext";
import { useInventory } from "../../../context/InventoryContext";

export default function EditProductPage() {
  const { authReady, token } = useRequireAuth();
  const { products } = useInventory();
  const router = useRouter();
  const { id } = router.query;

  if (!authReady || !token) return null;

  const product = typeof id === "string" ? products.find((p) => p.id === id) : null;

  return (
    <PageShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">Update details and stock.</p>
        </div>
        <Link className="text-sm text-indigo-600 hover:underline" href="/products">
          Back to list
        </Link>
      </div>
      {!product ? <p className="text-gray-600">Product not found.</p> : <ProductForm product={product} />}
    </PageShell>
  );
}

