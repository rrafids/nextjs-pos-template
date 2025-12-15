import PageShell from "../../components/PageShell";
import CategoryManager from "../../components/CategoryManager";
import { useRequireAuth } from "../../context/AuthContext";

export default function CategoriesPage() {
  const { authReady, token } = useRequireAuth();
  if (!authReady || !token) return null;

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-600">Create categories and subcategories.</p>
      </div>
      <CategoryManager />
    </PageShell>
  );
}

