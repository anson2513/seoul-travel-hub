"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import BottomNav from "@/components/dashboard/BottomNav";
import {
  accountingDays,
  accountingStorageKey,
  defaultAccountingState,
  expenseCategoryLabels,
  fallbackKrwPerTwd,
  paymentMethodLabels,
  taxFreeNearThresholdKrw,
  taxFreeThresholdKrw,
  taxStatusLabels,
  type AccountingState,
  type ExpenseCategory,
  type ExpenseCurrency,
  type ExpenseEntry,
  type PaymentMethod,
  type TaxStatus,
} from "@/lib/accounting-data";

type AccountingClientProps = {
  initialRate: number | null;
};

type ExpenseFormState = {
  title: string;
  date: string;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  taxStatus: TaxStatus;
  currency: ExpenseCurrency;
  amount: string;
};

const emptyExpenseForm: ExpenseFormState = {
  title: "",
  date: "2026-10-10",
  category: "food",
  paymentMethod: "cash",
  taxStatus: "none",
  currency: "KRW",
  amount: "",
};

function readStoredAccounting() {
  if (typeof window === "undefined") return defaultAccountingState;

  try {
    const raw = window.localStorage.getItem(accountingStorageKey);
    if (!raw) return defaultAccountingState;

    const parsed = JSON.parse(raw) as AccountingState;
    if (!Array.isArray(parsed.expenses)) return defaultAccountingState;

    return {
      budgetTwd:
        typeof parsed.budgetTwd === "number"
          ? parsed.budgetTwd
          : defaultAccountingState.budgetTwd,
      expenses: parsed.expenses,
    };
  } catch {
    return defaultAccountingState;
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-TW").format(Math.round(value));
}

function formatTwd(value: number) {
  return `NT$ ${formatNumber(value)}`;
}

function formatKrw(value: number, withParentheses = true) {
  const text = `₩ ${formatNumber(value)}`;
  return withParentheses ? `(${text})` : text;
}

function displayDate(date: string) {
  const [, month, day] = date.split("-");
  return month && day ? `${month}.${day}` : date;
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function cleanAmount(value: string) {
  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
}

function expenseToForm(expense: ExpenseEntry): ExpenseFormState {
  return {
    title: expense.title,
    date: expense.date,
    category: expense.category,
    paymentMethod: expense.paymentMethod,
    taxStatus: expense.taxStatus,
    currency: expense.currency,
    amount: String(expense.amount),
  };
}

function toTwd(expense: ExpenseEntry) {
  if (expense.currency === "TWD") return expense.amount;
  return expense.amount / expense.rateKrwPerTwd;
}

function toKrw(expense: ExpenseEntry) {
  if (expense.currency === "KRW") return expense.amount;
  return expense.amount * expense.rateKrwPerTwd;
}

function taxHintForKrw(krwAmount: number, taxStatus: TaxStatus) {
  if (taxStatus === "refunded") {
    return {
      label: "已退稅",
      detail: "這筆已完成退稅",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  if (krwAmount >= taxFreeThresholdKrw) {
    return {
      label: taxStatus === "pending" ? "未退稅" : "可退稅",
      detail: `滿 ${formatKrw(taxFreeThresholdKrw, false)} 可辦理退稅`,
      className: "bg-orange-50 text-orange-700",
    };
  }

  if (krwAmount >= taxFreeNearThresholdKrw) {
    return {
      label: `差 ${formatKrw(taxFreeThresholdKrw - krwAmount, false)}`,
      detail: "再多一點就有退稅資格",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return null;
}

export default function AccountingClient({ initialRate }: AccountingClientProps) {
  const rateKrwPerTwd = initialRate ?? fallbackKrwPerTwd;
  const [accounting, setAccounting] = useState(defaultAccountingState);
  const [activeDate, setActiveDate] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyExpenseForm);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(
    String(defaultAccountingState.budgetTwd),
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredAccounting();
    setAccounting(stored);
    setBudgetDraft(String(stored.budgetTwd));
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(accountingStorageKey, JSON.stringify(accounting));
    } catch {
      window.alert("記帳資料暫時無法儲存，可能是瀏覽器本機空間不足。");
    }
  }, [accounting, hasHydrated]);

  const filteredExpenses = useMemo(() => {
    const expenses =
      activeDate === "all"
        ? accounting.expenses
        : accounting.expenses.filter((expense) => expense.date === activeDate);

    return [...expenses].sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [accounting.expenses, activeDate]);

  const totalTwd = useMemo(
    () => accounting.expenses.reduce((sum, expense) => sum + toTwd(expense), 0),
    [accounting.expenses],
  );
  const remainingTwd = accounting.budgetTwd - totalTwd;
  const usedPercent =
    accounting.budgetTwd > 0
      ? Math.min(100, Math.round((totalTwd / accounting.budgetTwd) * 100))
      : 0;

  const categoryTotals = useMemo(() => {
    const totals = new Map<ExpenseCategory, number>();

    accounting.expenses.forEach((expense) => {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + toTwd(expense));
    });

    return [...totals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [accounting.expenses]);

  const previewAmount = parseAmount(formState.amount);
  const previewKrw =
    formState.currency === "KRW" ? previewAmount : previewAmount * rateKrwPerTwd;
  const previewTwd =
    formState.currency === "TWD" ? previewAmount : previewAmount / rateKrwPerTwd;
  const previewTaxHint = taxHintForKrw(previewKrw, formState.taxStatus);

  function resetForm() {
    setEditingId(null);
    setFormState({
      ...emptyExpenseForm,
      date: activeDate === "all" ? emptyExpenseForm.date : activeDate,
    });
  }

  function startEdit(expense: ExpenseEntry) {
    setEditingId(expense.id);
    setFormState(expenseToForm(expense));
  }

  function saveBudget() {
    const nextBudget = parseAmount(budgetDraft);
    if (!nextBudget) {
      setBudgetDraft(String(accounting.budgetTwd));
      setIsBudgetEditing(false);
      return;
    }

    setAccounting((state) => ({ ...state, budgetTwd: nextBudget }));
    setBudgetDraft(String(nextBudget));
    setIsBudgetEditing(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amount = parseAmount(formState.amount);
    if (!amount) {
      window.alert("請輸入消費金額。");
      return;
    }

    const nextExpense: ExpenseEntry = {
      id: editingId ?? `expense-${Date.now()}`,
      title: formState.title.trim() || "未命名支出",
      date: formState.date,
      category: formState.category,
      paymentMethod: formState.paymentMethod,
      taxStatus: formState.taxStatus,
      currency: formState.currency,
      amount,
      rateKrwPerTwd,
      createdAt: editingId
        ? accounting.expenses.find((expense) => expense.id === editingId)?.createdAt ??
          new Date().toISOString()
        : new Date().toISOString(),
    };

    setAccounting((state) => {
      if (editingId) {
        return {
          ...state,
          expenses: state.expenses.map((expense) =>
            expense.id === editingId ? nextExpense : expense,
          ),
        };
      }

      return { ...state, expenses: [...state.expenses, nextExpense] };
    });

    resetForm();
  }

  function deleteExpense() {
    if (!editingId) return;
    const shouldDelete = window.confirm("確定要刪除這筆支出嗎？");
    if (!shouldDelete) return;

    setAccounting((state) => ({
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== editingId),
    }));
    resetForm();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F7F5F2]">
      <div className="mx-auto max-w-[430px] px-5 pb-36 pt-10">
        <header>
          <h1 className="text-4xl font-bold tracking-normal text-neutral-950">
            旅行記帳
          </h1>
          <p className="mt-1 text-lg font-semibold text-neutral-700">
            Expense Tracker
          </p>
        </header>

        <section className="mt-7 rounded-[26px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-500">預算</p>
              {isBudgetEditing ? (
                <input
                  autoFocus
                  className="mt-1 h-10 w-full rounded-xl border border-neutral-200 px-3 text-xl font-bold outline-none focus:border-neutral-950"
                  inputMode="numeric"
                  onChange={(event) => setBudgetDraft(cleanAmount(event.target.value))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveBudget();
                  }}
                  value={budgetDraft}
                />
              ) : (
                <p className="mt-1 text-xl font-bold text-neutral-950">
                  {formatTwd(accounting.budgetTwd)}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-500">剩餘</p>
              <p
                className={`mt-1 text-lg font-bold ${
                  remainingTwd < 0 ? "text-red-600" : "text-neutral-950"
                }`}
              >
                {formatTwd(remainingTwd)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-[#2c1f1b]"
              style={{ width: `${usedPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-semibold text-neutral-500">
            <span>已使用 {usedPercent}%</span>
            {isBudgetEditing ? (
              <button
                className="font-bold text-neutral-950"
                onClick={saveBudget}
                type="button"
              >
                儲存預算
              </button>
            ) : (
              <button
                className="font-bold text-neutral-950"
                onClick={() => setIsBudgetEditing(true)}
                type="button"
              >
                修改預算
              </button>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[22px] bg-[#321f1a] p-5 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/70">總花費 (TWD)</p>
          <p className="mt-3 text-4xl font-bold">{formatTwd(totalTwd)}</p>
          <p className="mt-3 text-xs font-semibold text-white/55">
            匯率估算：1 TWD = {rateKrwPerTwd.toFixed(2)} KRW
          </p>
        </section>

        {categoryTotals.length > 0 && (
          <section className="mt-4 grid grid-cols-3 gap-2">
            {categoryTotals.map(([category, amount]) => (
              <div
                className="rounded-2xl border border-neutral-200 bg-white p-3 text-center shadow-sm"
                key={category}
              >
                <p className="text-xs font-bold text-neutral-500">
                  {expenseCategoryLabels[category]}
                </p>
                <p className="mt-1 text-sm font-bold text-neutral-950">
                  {formatTwd(amount)}
                </p>
              </div>
            ))}
          </section>
        )}

        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-2">
          {accountingDays.map((day) => {
            const isActive = activeDate === day.id;

            return (
              <button
                className={`min-w-fit rounded-full border px-5 py-3 text-sm font-bold shadow-sm transition ${
                  isActive
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600"
                }`}
                key={day.id}
                onClick={() => setActiveDate(day.id)}
                type="button"
              >
                {day.id === "all" ? day.label : `${day.date}`}
              </button>
            );
          })}
        </div>

        <section className="mt-3 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
          {filteredExpenses.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-lg font-bold text-neutral-950">尚未新增支出</p>
              <p className="mt-2 text-sm font-semibold text-neutral-500">
                旅行中可以在下方直接新增餐飲、交通、購物等消費。
              </p>
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const krwAmount = toKrw(expense);
              const taxHint = taxHintForKrw(krwAmount, expense.taxStatus);

              return (
                <button
                  className="grid w-full grid-cols-[1fr_auto] gap-3 border-b border-neutral-100 px-4 py-4 text-left last:border-b-0 active:bg-neutral-50"
                  key={expense.id}
                  onClick={() => startEdit(expense)}
                  type="button"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-neutral-950">
                      {expense.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600">
                        {displayDate(expense.date)}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600">
                        {expenseCategoryLabels[expense.category]}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600">
                        {paymentMethodLabels[expense.paymentMethod]}
                      </span>
                      {taxHint && (
                        <span className={`rounded-full px-2.5 py-1 ${taxHint.className}`}>
                          {taxHint.label}
                        </span>
                      )}
                    </div>
                    {taxHint && (
                      <p className="mt-2 text-xs font-semibold text-neutral-500">
                        {taxHint.detail}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-neutral-950">
                      {formatTwd(toTwd(expense))}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-neutral-500">
                      {formatKrw(krwAmount)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </section>

        <section className="mt-6 rounded-[26px] border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                {editingId ? "編輯記帳" : "新增記帳"}
              </h2>
              <p className="mt-1 text-sm font-semibold text-neutral-500">
                台幣會自動換算，韓幣滿額會提醒退稅。
              </p>
            </div>
            {editingId && (
              <button
                className="rounded-full bg-neutral-100 px-3 py-2 text-sm font-bold text-neutral-700"
                onClick={resetForm}
                type="button"
              >
                取消
              </button>
            )}
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({ ...state, title: event.target.value }))
              }
              placeholder="例如：午餐、地鐵、購物"
              value={formState.title}
            />

            <select
              className="h-12 w-full rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
              onChange={(event) =>
                setFormState((state) => ({ ...state, date: event.target.value }))
              }
              value={formState.date}
            >
              {accountingDays
                .filter((day) => day.id !== "all")
                .map((day) => (
                  <option key={day.id} value={day.id}>
                    {day.label} · {day.date}
                  </option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <select
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    category: event.target.value as ExpenseCategory,
                  }))
                }
                value={formState.category}
              >
                {Object.entries(expenseCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    paymentMethod: event.target.value as PaymentMethod,
                  }))
                }
                value={formState.paymentMethod}
              >
                {Object.entries(paymentMethodLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-neutral-200 p-1">
              {Object.entries(taxStatusLabels).map(([value, label]) => {
                const isActive = formState.taxStatus === value;

                return (
                  <button
                    className={`h-11 rounded-xl text-sm font-bold transition ${
                      isActive
                        ? "bg-neutral-950 text-white"
                        : "bg-white text-neutral-600"
                    }`}
                    key={value}
                    onClick={() =>
                      setFormState((state) => ({
                        ...state,
                        taxStatus: value as TaxStatus,
                      }))
                    }
                    type="button"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-[128px_1fr] gap-3">
              <select
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-bold outline-none focus:border-neutral-950"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    currency: event.target.value as ExpenseCurrency,
                  }))
                }
                value={formState.currency}
              >
                <option value="KRW">KRW (₩)</option>
                <option value="TWD">TWD (NT$)</option>
              </select>

              <input
                className="h-12 rounded-xl border border-neutral-200 px-4 text-base font-semibold outline-none focus:border-neutral-950"
                inputMode="decimal"
                onChange={(event) =>
                  setFormState((state) => ({
                    ...state,
                    amount: cleanAmount(event.target.value),
                  }))
                }
                placeholder="0"
                value={formState.amount}
              />
            </div>

            {previewAmount > 0 && (
              <div className="rounded-2xl bg-neutral-50 p-3 text-sm font-semibold text-neutral-600">
                <div className="flex items-center justify-between gap-3">
                  <span>估算台幣</span>
                  <span className="font-bold text-neutral-950">
                    {formatTwd(previewTwd)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span>韓幣金額</span>
                  <span>{formatKrw(previewKrw)}</span>
                </div>
                {previewTaxHint && (
                  <p className="mt-2 text-orange-700">{previewTaxHint.detail}</p>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <button
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-neutral-950 text-lg font-bold text-white"
                type="submit"
              >
                {editingId ? "儲存修改" : "+ 新增支出"}
              </button>

              {editingId && (
                <button
                  className="h-12 rounded-2xl border border-red-100 bg-red-50 text-sm font-bold text-red-600"
                  onClick={deleteExpense}
                  type="button"
                >
                  刪除這筆支出
                </button>
              )}
            </div>
          </form>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
