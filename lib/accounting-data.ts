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

export const accountingStorageKey = "seoul-travel-hub-accounting-v2";
export const defaultBudgetTwd = 50000;
export const fallbackKrwPerTwd = 42.5;
export const taxFreeThresholdKrw = 15000;
export const taxFreeNearThresholdKrw = 14000;

export const defaultSampleExpenses: ExpenseEntry[] = [
  {
    id: "sample-starbucks",
    title: "星巴克咖啡",
    date: "2026-10-10",
    category: "cafe",
    paymentMethod: "cash",
    taxStatus: "none",
    currency: "KRW",
    amount: 7000,
    rateKrwPerTwd: fallbackKrwPerTwd,
    createdAt: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "sample-olive-young",
    title: "OLIVE YOUNG 購物",
    date: "2026-10-10",
    category: "shopping",
    paymentMethod: "card",
    taxStatus: "pending",
    currency: "KRW",
    amount: 54000,
    rateKrwPerTwd: fallbackKrwPerTwd,
    createdAt: "2026-10-10T10:00:00.000Z",
  },
  {
    id: "sample-taxi",
    title: "計程車車資",
    date: "2026-10-10",
    category: "transport",
    paymentMethod: "cash",
    taxStatus: "none",
    currency: "KRW",
    amount: 13500,
    rateKrwPerTwd: fallbackKrwPerTwd,
    createdAt: "2026-10-10T11:00:00.000Z",
  },
  {
    id: "sample-myeongdong-dumplings",
    title: "明洞餃子",
    date: "2026-10-10",
    category: "food",
    paymentMethod: "cash",
    taxStatus: "none",
    currency: "KRW",
    amount: 10500,
    rateKrwPerTwd: fallbackKrwPerTwd,
    createdAt: "2026-10-10T12:00:00.000Z",
  },
];

export const defaultAccountingState: AccountingState = {
  budgetTwd: defaultBudgetTwd,
  expenses: defaultSampleExpenses,
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
