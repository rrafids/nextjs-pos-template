import PageShell from "../components/PageShell";
import CategoryManager from "../components/CategoryManager";
import { useRequireAuth } from "../context/AuthContext";

export default function CategoriesPage() {
  const { authReady, token } = useRequireAuth();

  if (!authReady || !token) return null;

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Manage categories and subcategories for your products.</p>
      </div>
      <CategoryManager />
    </PageShell>
  );
}

