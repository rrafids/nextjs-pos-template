import Link from "next/link";
import PageShell from "../../../components/PageShell";
import ProductForm from "../../../components/ProductForm";
import { useRequireAuth } from "../../../context/AuthContext";

export default function NewProductPage() {
  const { authReady, token } = useRequireAuth();

  if (!authReady || !token) return null;

  return (
    <PageShell>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
          <p className="text-sm text-gray-600">Create a product and set its stock.</p>
        </div>
        <Link className="text-sm text-blue-600 hover:underline" href="/inventory">
          Back to list
        </Link>
      </div>
      <ProductForm />
    </PageShell>
  );
}

