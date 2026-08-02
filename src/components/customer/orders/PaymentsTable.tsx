import type { CustomerPayment } from "@/src/types/customer";
import StatusBadge from "./StatusBadge";

export default function PaymentsTable({ payments }: { payments: CustomerPayment[] }) {
  return <div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Payment</th><th className="p-3">Order</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Status</th></tr></thead><tbody>{payments.map((payment) => <tr className="border-t" key={payment.id}><td className="p-3">{payment.id.slice(0, 8)}</td><td className="p-3">{payment.rentalOrderId.slice(0, 8)}</td><td className="p-3">৳{payment.amount}</td><td className="p-3">{payment.method ?? "Stripe"}</td><td className="p-3"><StatusBadge status={payment.status} /></td></tr>)}{!payments.length ? <tr><td className="p-10 text-center text-muted-foreground" colSpan={5}>No payments found.</td></tr> : null}</tbody></table></div>;
}
