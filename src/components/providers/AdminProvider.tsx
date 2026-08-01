"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/src/lib/api-error";
import { adminService } from "@/src/services/admin/admin.service";
import type { AdminStats } from "@/src/types/admin";

type AdminContextValue = {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setStats(await adminService.getStats());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load dashboard statistics"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    void adminService.getStats().then(
      (nextStats) => {
        if (isMounted) {
          setStats(nextStats);
          setError(null);
          setIsLoading(false);
        }
      },
      (requestError: unknown) => {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, "Unable to load dashboard statistics"));
          setIsLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [refreshStats]);

  return (
    <AdminContext.Provider value={{ stats, isLoading, error, refreshStats }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }

  return context;
}
