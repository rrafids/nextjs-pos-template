import PageShell from "../../components/PageShell";
import { useRequireAuth } from "../../context/AuthContext";
import { useInventory, SaleRecord } from "../../context/InventoryContext";

export default function OutboundHistoryPage() {
  const { authReady, token } = useRequireAuth();
  const { sales, products } = useInventory();

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
        <h1 className="page-title">Outbound History</h1>
        <p className="page-subtitle">View all sales records.</p>
      </div>
      <div className="card">
        {sales.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No sales records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sales.map((sale: SaleRecord) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{formatDate(sale.timestamp)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{getProductName(sale.productId)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">-{sale.quantity}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">Rp {sale.total.toFixed(2)}</td>
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

