import PageShell from "../../components/PageShell";
import { useRequireAuth } from "../../context/AuthContext";
import { useInventory, PurchaseRecord } from "../../context/InventoryContext";

export default function InboundHistoryPage() {
  const { authReady, token } = useRequireAuth();
  const { purchases, products } = useInventory();

  if (!authReady || !token) return null;

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.name ?? "Unknown Product";
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="page-title">Inbound History</h1>
        <p className="page-subtitle">View all stock purchase records.</p>
      </div>
      <div className="card">
        {!purchases || purchases.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No purchase records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {purchases.map((purchase: PurchaseRecord) => (
                  <tr key={purchase.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{formatDate(purchase.timestamp)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{getProductName(purchase.productId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">+{purchase.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}

