import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

export type Category = {
  id: string;
  name: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  subcategoryIds: string[];
};

export type SaleRecord = {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  timestamp: string;
};

export type PurchaseRecord = {
  id: string;
  productId: string;
  quantity: number;
  timestamp: string;
};

type InventoryState = {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  sales: SaleRecord[];
  purchases: PurchaseRecord[];
};

type InventoryContextValue = InventoryState & {
  addCategory: (name: string) => Category | null;
  addSubcategory: (name: string, categoryId: string) => Subcategory | null;
  upsertProduct: (product: Omit<Product, "id"> & { id?: string }) => Product | null;
  sell: (productId: string, quantity: number) => { success: boolean; message?: string };
  purchase: (productId: string, quantity: number) => { success: boolean; message?: string };
};

const STORAGE_KEY = "pos-ui/inventory";

const defaultState: InventoryState = {
  categories: [],
  subcategories: [],
  products: [],
  sales: [],
  purchases: [],
};

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InventoryState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<InventoryState>;
        // Merge with defaults to ensure all fields exist (handles old localStorage data)
        setState({
          categories: parsed.categories ?? defaultState.categories,
          subcategories: parsed.subcategories ?? defaultState.subcategories,
          products: parsed.products ?? defaultState.products,
          sales: parsed.sales ?? defaultState.sales,
          purchases: parsed.purchases ?? defaultState.purchases,
        });
      } catch {
        // ignore parse issues and start clean
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const exists = state.categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return null;
    const newCategory: Category = { id: uuid(), name: trimmed };
    setState((prev) => ({ ...prev, categories: [...prev.categories, newCategory] }));
    return newCategory;
  };

  const addSubcategory = (name: string, categoryId: string) => {
    const trimmed = name.trim();
    if (!trimmed || !categoryId) return null;
    const exists = state.subcategories.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase() && s.categoryId === categoryId
    );
    if (exists) return null;
    const newSubcategory: Subcategory = { id: uuid(), name: trimmed, categoryId };
    setState((prev) => ({ ...prev, subcategories: [...prev.subcategories, newSubcategory] }));
    return newSubcategory;
  };

  const upsertProduct = (product: Omit<Product, "id"> & { id?: string }) => {
    const trimmedName = product.name.trim();
    const trimmedSku = product.sku.trim();
    if (!trimmedName || !trimmedSku) return null;
    const parsedPrice = Number(product.price);
    const parsedStock = Number(product.stock);
    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) return null;

    const productId = product.id ?? uuid();
    const next: Product = {
      ...product,
      id: productId,
      name: trimmedName,
      sku: trimmedSku,
      price: parsedPrice,
      stock: Math.max(0, Math.floor(parsedStock)),
      subcategoryIds: product.subcategoryIds,
    };

    setState((prev) => {
      const existingIdx = prev.products.findIndex((p) => p.id === productId);
      if (existingIdx >= 0) {
        const updated = [...prev.products];
        updated[existingIdx] = next;
        return { ...prev, products: updated };
      }
      return { ...prev, products: [...prev.products, next] };
    });
    return { ...next };
  };

  const sell = (productId: string, quantity: number) => {
    if (quantity <= 0) return { success: false, message: "Quantity must be positive" };
    const product = state.products.find((p) => p.id === productId);
    if (!product) return { success: false, message: "Product not found" };
    const actualQty = Math.min(quantity, product.stock);
    if (actualQty <= 0) return { success: false, message: "No stock available" };
    const total = Number((product.price * actualQty).toFixed(2));
    const sale: SaleRecord = {
      id: uuid(),
      productId,
      quantity: actualQty,
      total,
      timestamp: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock - actualQty) } : p
      ),
      sales: [sale, ...(prev.sales ?? [])],
    }));
    return { success: true };
  };

  const purchase = (productId: string, quantity: number) => {
    if (quantity <= 0) return { success: false, message: "Quantity must be positive" };
    const product = state.products.find((p) => p.id === productId);
    if (!product) return { success: false, message: "Product not found" };
    const purchaseRecord: PurchaseRecord = {
      id: uuid(),
      productId,
      quantity,
      timestamp: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === productId ? { ...p, stock: p.stock + quantity } : p)),
      purchases: [purchaseRecord, ...(prev.purchases ?? [])],
    }));
    return { success: true };
  };

  const value = useMemo<InventoryContextValue>(
    () => ({
      ...state,
      addCategory,
      addSubcategory,
      upsertProduct,
      sell,
      purchase,
    }),
    [state]
  );

  return <InventoryContext.Provider value={value}>{loaded ? children : null}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}

