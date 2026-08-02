"use client";

import { ReceiptText, ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerShell from "@/src/components/customer/CustomerShell";
import OrdersTable from "@/src/components/customer/orders/OrdersTable";
import Pagination from "@/src/components/customer/orders/Pagination";
import PaymentsTable from "@/src/components/customer/orders/PaymentsTable";
import ReviewDialog from "@/src/components/customer/orders/ReviewDialog";
import type {
  PaginationMeta,
  ReviewTarget,
} from "@/src/components/customer/orders/types";
import { getApiErrorMessage } from "@/src/lib/api-error";
import {
  getMyPayments,
  getMyRentals,
} from "@/src/services/customer/customer.service";
import type { CustomerPayment, CustomerRental } from "@/src/types/customer";

const emptyMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPage: 1,
};

export default function Orders() {
  return (
    <CustomerShell>
      <OrdersContent />
    </CustomerShell>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<CustomerRental[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [ordersMeta, setOrdersMeta] = useState<PaginationMeta>(emptyMeta);
  const [paymentsMeta, setPaymentsMeta] = useState<PaginationMeta>(emptyMeta);
  const [ordersPage, setOrdersPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rentalResult, paymentResult] = await Promise.all([
        getMyRentals({ page: ordersPage, limit }),
        getMyPayments({ page: paymentsPage, limit }),
      ]);
      setOrders(rentalResult.rentals);
      setPayments(paymentResult.payments);
      setOrdersMeta(
        rentalResult.meta ?? {
          ...emptyMeta,
          page: ordersPage,
          limit,
          total: rentalResult.rentals.length,
        },
      );
      setPaymentsMeta(
        paymentResult.meta ?? {
          ...emptyMeta,
          page: paymentsPage,
          limit,
          total: paymentResult.payments.length,
        },
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load your orders"));
    } finally {
      setIsLoading(false);
    }
  }, [limit, ordersPage, paymentsPage]);
  useEffect(() => {
    void Promise.resolve().then(loadOrders);
  }, [loadOrders]);
  function updateLimit(value: string | null) {
    const nextLimit = Number(value);
    if (!nextLimit) return;
    setLimit(nextLimit);
    setOrdersPage(1);
    setPaymentsPage(1);
  }
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">My activity</h1>
        <p className="mt-2 text-muted-foreground">
          Manage rental orders and view your Stripe payment history.
        </p>
      </div>
      {isLoading ? (
        <div className="mt-8 h-72 animate-pulse rounded-2xl bg-muted" />
      ) : null}
      {error ? (
        <div className="mt-8 rounded-xl bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
          <Button
            className="mt-3"
            onClick={() => void loadOrders()}
            size="sm"
            variant="outline"
          >
            Try again
          </Button>
        </div>
      ) : null}
      {!isLoading && !error ? (
        <Tabs className="mt-8" defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">
              <ShoppingBag />
              Rental orders
            </TabsTrigger>
            <TabsTrigger value="payments">
              <ReceiptText />
              Payment history
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-5" value="orders">
            <OrdersTable onReview={setReviewTarget} orders={orders} />
            <Pagination
              limit={limit}
              meta={ordersMeta}
              onLimitChange={updateLimit}
              onPageChange={setOrdersPage}
            />
          </TabsContent>
          <TabsContent className="mt-5" value="payments">
            <PaymentsTable payments={payments} />
            <Pagination
              limit={limit}
              meta={paymentsMeta}
              onLimitChange={updateLimit}
              onPageChange={setPaymentsPage}
            />
          </TabsContent>
        </Tabs>
      ) : null}
      <ReviewDialog
        onCreated={() => {
          setReviewTarget(null);
          void loadOrders();
        }}
        onOpenChange={(open) => !open && setReviewTarget(null)}
        target={reviewTarget}
      />
    </main>
  );
}
