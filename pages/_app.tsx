import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import { InventoryProvider } from "../context/InventoryContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <InventoryProvider>
        <Component {...pageProps} />
      </InventoryProvider>
    </AuthProvider>
  );
}

