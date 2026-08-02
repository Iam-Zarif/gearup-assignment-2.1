"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { getProviderGear, getProviderOrders } from "@/src/services/provider/provider.service";
import type { ProviderGear, ProviderOrder } from "@/src/types/admin";

type ProviderContextValue = {
  gear: ProviderGear[];
  orders: ProviderOrder[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

export default function ProviderProvider({ children }: { children: React.ReactNode }) {
  const [gear, setGear] = useState<ProviderGear[]>([]);
  const [orders, setOrders] = useState<ProviderOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [nextGear, nextOrders] = await Promise.all([getProviderGear({ page: 1, limit: 100 }), getProviderOrders()]);
      setGear(nextGear.gear);
      setOrders(nextOrders);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load provider data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
    const intervalId = window.setInterval(() => void refresh(), 10000);
    const handleFocus = () => void refresh();
    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refresh]);

  return <ProviderContext.Provider value={{ gear, orders, isLoading, error, refresh }}>{children}</ProviderContext.Provider>;
}

export function useProviderData() {
  const context = useContext(ProviderContext);
  if (!context) throw new Error("useProviderData must be used inside ProviderProvider");
  return context;
}
