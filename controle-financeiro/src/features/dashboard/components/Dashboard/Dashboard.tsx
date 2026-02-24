"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SyntheticEvent,
} from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { getSupabaseClient, SUPABASE_ENV_ERROR } from "@/lib/supabase/client";
import styles from "./Dashboard.module.scss";
import { TbEdit, TbTrash } from "react-icons/tb";

type FilterType = "month" | "year";
type TransactionType = "income" | "expense";

interface DashboardProps {
  readonly userId: string;
  readonly userName: string;
  readonly onLogout: () => Promise<void> | void;
  readonly onOpenHero: () => void;
}

interface Transaction {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly type: TransactionType;
  readonly amount: number;
}

interface SupabaseTransactionRow {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly type: string;
  readonly amount: number | string;
}

type Feedback = {
  readonly kind: "error" | "success";
  readonly message: string;
} | null;

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

const toDate = (value: string) => new Date(`${value}T00:00:00`);
const toInputDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const sortTransactions = (items: readonly Transaction[]) =>
  [...items].sort(
    (a, b) => toDate(b.date).getTime() - toDate(a.date).getTime(),
  );

const formatDatabaseError = (message: string) => {
  if (message.includes('relation "transactions" does not exist')) {
    return "Tabela transactions não encontrada no Supabase. Execute o SQL em supabase/schema.sql.";
  }

  return message;
};

const normalizeRow = (
  row: SupabaseTransactionRow | null | undefined,
): Transaction | null => {
  if (!row) {
    return null;
  }

  const transactionType =
    row.type === "income" || row.type === "expense" ? row.type : null;
  const amount = Number(row.amount);

  if (!transactionType || !Number.isFinite(amount)) {
    return null;
  }

  return {
    id: row.id,
    date: row.date.slice(0, 10),
    description: row.description,
    type: transactionType,
    amount,
  };
};

export default function Dashboard({
  userId,
  userName,
  onLogout,
  onOpenHero,
}: DashboardProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const today = toInputDate(now);

  const [filterType, setFilterType] = useState<FilterType>("month");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [formData, setFormData] = useState({
    date: today,
    description: "",
    type: "" as TransactionType | "",
    amount: "",
  });

  const loadTransactions = useCallback(async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setFeedback({ kind: "error", message: SUPABASE_ENV_ERROR });
      setIsLoadingTransactions(false);
      return;
    }

    setIsLoadingTransactions(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("id, date, description, type, amount")
      .eq("user_id", userId);

    if (error) {
      setFeedback({
        kind: "error",
        message: formatDatabaseError(error.message),
      });
      setIsLoadingTransactions(false);
      return;
    }

    const normalizedTransactions = sortTransactions(
      (data ?? [])
        .map((row) => normalizeRow(row as SupabaseTransactionRow))
        .filter((row): row is Transaction => row !== null),
    );

    setTransactions(normalizedTransactions);
    setIsLoadingTransactions(false);
  }, [userId]);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      void loadTransactions();
    }, 0);

    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [loadTransactions]);

  const years = useMemo(() => {
    const values = new Set<number>([currentYear, selectedYear]);

    for (const transaction of transactions) {
      values.add(toDate(transaction.date).getFullYear());
    }

    return [...values].sort((a, b) => b - a);
  }, [currentYear, selectedYear, transactions]);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const transactionDate = toDate(transaction.date);
        const sameYear = transactionDate.getFullYear() === selectedYear;

        if (!sameYear) {
          return false;
        }

        if (filterType === "year") {
          return true;
        }

        return transactionDate.getMonth() + 1 === selectedMonth;
      }),
    [filterType, selectedMonth, selectedYear, transactions],
  );

  const income = useMemo(
    () =>
      filteredTransactions.reduce(
        (total, transaction) =>
          transaction.type === "income" ? total + transaction.amount : total,
        0,
      ),
    [filteredTransactions],
  );

  const expense = useMemo(
    () =>
      filteredTransactions.reduce(
        (total, transaction) =>
          transaction.type === "expense" ? total + transaction.amount : total,
        0,
      ),
    [filteredTransactions],
  );

  const periodTotal = income - expense;

  const accumulatedTotal = useMemo(() => {
    const periodEnd =
      filterType === "month"
        ? new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999)
        : new Date(selectedYear, 11, 31, 23, 59, 59, 999);

    return transactions.reduce((total, transaction) => {
      if (toDate(transaction.date) > periodEnd) {
        return total;
      }

      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  }, [filterType, selectedMonth, selectedYear, transactions]);

  const currentPeriodLabel =
    filterType === "month"
      ? `${MONTHS[selectedMonth - 1]} de ${selectedYear}`
      : `Resumo Geral de ${selectedYear}`;

  const isSubmitDisabled =
    isMutating ||
    isLoadingTransactions ||
    !formData.date ||
    !formData.description.trim() ||
    !formData.type ||
    Number(formData.amount) <= 0;

  const handleTransactionSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const supabase = getSupabaseClient();

    if (!supabase) {
      setFeedback({ kind: "error", message: SUPABASE_ENV_ERROR });
      return;
    }

    const amount = Number(formData.amount);

    if (!formData.type || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const transactionType = formData.type;
    setIsMutating(true);
    setFeedback(null);

    if (editingId) {
      const { data, error } = await supabase
        .from("transactions")
        .update({
          date: formData.date,
          description: formData.description.trim(),
          type: transactionType,
          amount,
        })
        .eq("id", editingId)
        .eq("user_id", userId)
        .select("id, date, description, type, amount");

      if (error) {
        setFeedback({
          kind: "error",
          message: formatDatabaseError(error.message),
        });
        setIsMutating(false);
        return;
      }

      const updatedTransaction = normalizeRow(
        data?.[0] as SupabaseTransactionRow | undefined,
      );

      if (!updatedTransaction) {
        setFeedback({
          kind: "error",
          message:
            "Não foi possível atualizar a transação. Verifique as políticas RLS da tabela transactions.",
        });
        setIsMutating(false);
        return;
      }

      setTransactions((current) =>
        sortTransactions(
          current.map((transaction) =>
            transaction.id === editingId ? updatedTransaction : transaction,
          ),
        ),
      );
      setFeedback({
        kind: "success",
        message: "Transação atualizada com sucesso.",
      });
    } else {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          date: formData.date,
          description: formData.description.trim(),
          type: transactionType,
          amount,
        })
        .select("id, date, description, type, amount");

      if (error) {
        setFeedback({
          kind: "error",
          message: formatDatabaseError(error.message),
        });
        setIsMutating(false);
        return;
      }

      const insertedTransaction = normalizeRow(
        data?.[0] as SupabaseTransactionRow | undefined,
      );

      if (!insertedTransaction) {
        setFeedback({
          kind: "error",
          message:
            "Não foi possível salvar a transação. Verifique as políticas RLS da tabela transactions.",
        });
        setIsMutating(false);
        return;
      }

      setTransactions((current) =>
        sortTransactions([...current, insertedTransaction]),
      );
      setFeedback({
        kind: "success",
        message: "Transação adicionada com sucesso.",
      });
    }

    setFormData({
      date: toInputDate(),
      description: "",
      type: "",
      amount: "",
    });
    setEditingId(null);
    setIsMutating(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setFormData({
      date: transaction.date,
      description: transaction.description,
      type: transaction.type,
      amount: String(transaction.amount),
    });
  };

  const handleDelete = async (transactionId: string) => {
    const shouldDelete = globalThis.confirm("Tem certeza que deseja excluir?");

    if (!shouldDelete) {
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setFeedback({ kind: "error", message: SUPABASE_ENV_ERROR });
      return;
    }

    setIsMutating(true);
    setFeedback(null);

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("user_id", userId);

    if (error) {
      setFeedback({
        kind: "error",
        message: formatDatabaseError(error.message),
      });
      setIsMutating(false);
      return;
    }

    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== transactionId),
    );

    if (editingId === transactionId) {
      setEditingId(null);
      setFormData({
        date: toInputDate(),
        description: "",
        type: "",
        amount: "",
      });
    }

    setFeedback({
      kind: "success",
      message: "Transação removida com sucesso.",
    });
    setIsMutating(false);
  };

  return (
    <section className={styles.page}>
      <Navbar
        mode="authenticated"
        userName={userName}
        onLogout={onLogout}
        onLogoClick={onOpenHero}
      />

      <main className={styles.dashboardContainer}>
        <section className={styles.dashboardHeaderBar}>
          <span>Dashboard</span>
        </section>

        {isLoadingTransactions && (
          <section className={`${styles.statusMessage} ${styles.infoStatus}`}>
            Carregando transações...
          </section>
        )}

        {feedback && (
          <section
            className={`${styles.statusMessage} ${
              feedback.kind === "error"
                ? styles.errorStatus
                : styles.successStatus
            }`}
          >
            {feedback.message}
          </section>
        )}

        <section className={styles.cardsWrap}>
          <section className={styles.summaryCard}>
            <section className={styles.summaryNav}>
              <h2 className={styles.currentPeriod}>{currentPeriodLabel}</h2>
              <section className={styles.filterControls}>
                <select
                  value={filterType}
                  onChange={(event) =>
                    setFilterType(event.target.value as FilterType)
                  }
                >
                  <option value="month">Por Mês</option>
                  <option value="year">Por Ano</option>
                </select>
                {filterType === "month" && (
                  <select
                    value={selectedMonth}
                    onChange={(event) =>
                      setSelectedMonth(Number(event.target.value))
                    }
                  >
                    {MONTHS.map((monthName, index) => (
                      <option key={monthName} value={index + 1}>
                        {monthName}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={selectedYear}
                  onChange={(event) =>
                    setSelectedYear(Number(event.target.value))
                  }
                >
                  {years.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
              </section>
            </section>
            <section className={styles.summaryValues}>
              <section className={styles.summaryItem}>
                <span>Entradas (Período)</span>
                <span className={styles.valuePositive}>
                  {currencyFormatter.format(income)}
                </span>
              </section>
              <section className={styles.summaryItem}>
                <span>Saídas (Período)</span>
                <span className={styles.valueNegative}>
                  {currencyFormatter.format(expense)}
                </span>
              </section>
              <section className={styles.summaryItem}>
                <span>Balanço (Período)</span>
                <span
                  className={
                    periodTotal >= 0 ? styles.valuePositive : styles.valueNegative
                  }
                >
                  {currencyFormatter.format(periodTotal)}
                </span>
              </section>
              <section
                className={`${styles.summaryItem} ${styles.totalAccumulated}`}
              >
                <span>Total Acumulado</span>
                <span
                  className={
                    accumulatedTotal >= 0
                      ? styles.valuePositive
                      : styles.valueNegative
                  }
                >
                  {currencyFormatter.format(accumulatedTotal)}
                </span>
              </section>
            </section>
          </section>
          <section className={styles.inputCard}>
            <form onSubmit={handleTransactionSubmit}>
              <section className={styles.inputRow}>
                <section className={styles.inputGroup}>
                  <label htmlFor="transaction-date">Data</label>
                  <input
                    id="transaction-date"
                    type="date"
                    value={formData.date}
                    disabled={isLoadingTransactions || isMutating}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    required
                  />
                </section>
                <section className={styles.inputGroup}>
                  <label htmlFor="transaction-description">Descrição</label>
                  <input
                    id="transaction-description"
                    type="text"
                    value={formData.description}
                    disabled={isLoadingTransactions || isMutating}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    required
                  />
                </section>
                <section className={styles.inputGroup}>
                  <label htmlFor="transaction-type">Categoria</label>
                  <select
                    id="transaction-type"
                    value={formData.type}
                    disabled={isLoadingTransactions || isMutating}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        type: event.target.value as TransactionType | "",
                      }))
                    }
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="income">Entrada</option>
                    <option value="expense">Saída</option>
                  </select>
                </section>
                <section className={styles.inputGroup}>
                  <label htmlFor="transaction-amount">Valor</label>
                  <input
                    id="transaction-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    disabled={isLoadingTransactions || isMutating}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        amount: event.target.value,
                      }))
                    }
                    required
                  />
                </section>
                <button
                  type="submit"
                  className={styles.btnAdd}
                  disabled={isSubmitDisabled}
                >
                  {editingId ? "SALVAR" : "ADICIONAR"}
                </button>
              </section>
            </form>
            {editingId && (
              <button
                type="button"
                className={styles.cancelEditButton}
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    date: toInputDate(),
                    description: "",
                    type: "",
                    amount: "",
                  });
                }}
              >
                Cancelar edição
              </button>
            )}
          </section>
          <section className={styles.tableCard}>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyState}>
                      Nenhuma transação encontrada para o período selecionado.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td data-label="Data">
                        {dateFormatter.format(toDate(transaction.date))}
                      </td>
                      <td data-label="Descrição">{transaction.description}</td>
                      <td data-label="Categoria">
                        <span
                          className={`${styles.badge} ${
                            transaction.type === "income"
                              ? styles.badgeSuccess
                              : styles.badgeDanger
                          }`}
                        >
                          {transaction.type === "income" ? "Entrada" : "Saída"}
                        </span>
                      </td>
                      <td
                        data-label="Valor"
                        className={
                          transaction.type === "income"
                            ? styles.valuePositive
                            : styles.valueNegative
                        }
                      >
                        {currencyFormatter.format(transaction.amount)}
                      </td>
                      <td data-label="Ações" className={styles.actionsCell}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => handleEdit(transaction)}
                          title="Editar"
                          aria-label={`Editar ${transaction.description}`}
                          disabled={isMutating}
                        >
                          <TbEdit />
                        </button>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => handleDelete(transaction.id)}
                          title="Excluir"
                          aria-label={`Excluir ${transaction.description}`}
                          disabled={isMutating}
                        >
                          <TbTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </section>
      </main>

      <Footer />
    </section>
  );
}
