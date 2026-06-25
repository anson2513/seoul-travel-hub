import AccountingClient from "@/components/accounting/AccountingClient";
import { getTwdKrwRate } from "@/lib/live-info";

export default async function AccountingPage() {
  const exchange = await getTwdKrwRate();

  return <AccountingClient initialRate={exchange.rate} />;
}
