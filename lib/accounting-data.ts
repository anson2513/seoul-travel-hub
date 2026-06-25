export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "hotel"
  | "cafe"
  | "ticket"
  | "other";

export type PaymentMethod = "cash" | "card" | "mobile";
export type TaxStatus = "none" | "pending" | "refunded";
export type ExpenseCurrency = "KRW" | "TWD";

export type ExpenseEntry = {
  id: string;
  title: string;
  date: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  taxStatus: TaxStatus;
  currency: ExpenseCurrency;
  amount: number;
  rateKrwPerTwd: number;
  createdAt: string;
};

export type AccountingState = {
  budgetTwd: number;
  expenses: ExpenseEntry[];
};

export const accountingStorageKey = "seoul-travel-hub-accounting-v1";
export const defaultBudgetTwd = 50000;
export const fallbackKrwPerTwd = 42.5;
export const taxFreeThresholdKrw = 15000;
export const taxFreeNearThresholdKrw = 14000;

export const defaultAccountingState: AccountingState = {
  budgetTwd: defaultBudgetTwd,
  expenses: [],
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  food: "餐飲",
  transport: "交通",
  shopping: "購物",
  hotel: "住宿",
  cafe: "咖啡",
  ticket: "票券",
  other: "其他",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "現金",
  card: "信用卡",
  mobile: "行動支付",
};

export const taxStatusLabels: Record<TaxStatus, string> = {
  none: "無",
  pending: "未退稅",
  refunded: "已退稅",
};

export const accountingDays = [
  { id: "all", label: "全部", date: "" },
  { id: "2026-10-10", label: "DAY 1", date: "10.10" },
  { id: "2026-10-11", label: "DAY 2", date: "10.11" },
  { id: "2026-10-12", label: "DAY 3", date: "10.12" },
  { id: "2026-10-13", label: "DAY 4", date: "10.13" },
  { id: "2026-10-14", label: "DAY 5", date: "10.14" },
  { id: "2026-10-15", label: "DAY 6", date: "10.15" },
];
