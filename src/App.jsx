import React, { useEffect, useMemo, useState } from "react";
import { getTransactions, createTransaction, updateTransaction } from "./services/transactions";
import { getSummary } from "./services/stats";
import AddTransactionModal from "./components/AddTransactionModal.jsx";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

// Check if transaction is editable (within 12 hours)
function isTransactionEditable(transaction) {
  if (!transaction || !transaction.createdAt) return false;
  const now = new Date();
  const createdAt = new Date(transaction.createdAt);
  const diffHours = (now - createdAt) / (1000 * 60 * 60);
  return diffHours <= 12;
}

export default function App() {
  const [summary, setSummary] = useState({ month: {}, week: {}, year: {} });
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    division: "",
    category: "",
    fromDate: "",
    toDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.division) params.division = filters.division;
      if (filters.category) params.category = filters.category;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;

      const data = await getTransactions(params);
      setTransactions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
    loadTransactions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    loadTransactions();
  };

  const handleSaveTransaction = async (payload) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
      } else {
        await createTransaction(payload);
      }
      setIsModalOpen(false);
      setEditingTransaction(null);
      await Promise.all([loadSummary(), loadTransactions()]);
    } catch (e) {
      console.error(e);
      const errorMessage = e.response?.data?.message || 
        (editingTransaction ? "Failed to update transaction. It may be older than 12 hours." : "Failed to save transaction");
      alert(errorMessage);
    }
  };

  const handleEditTransaction = (transaction) => {
    if (!isTransactionEditable(transaction)) {
      alert("This transaction cannot be edited. Only transactions within 12 hours can be edited.");
      return;
    }
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const categoriesSummary = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const key = t.category;
      map[key] = map[key] || { income: 0, expense: 0 };
      if (t.type === "income") map[key].income += t.amount;
      if (t.type === "expense") map[key].expense += t.amount;
    });
    return map;
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Money Manager</h1>
            <p className="text-sm text-slate-500">
              Track your income, expenses, and transfers with ease.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500"
          >
            <span className="text-lg leading-none">＋</span>
            Add
          </button>
        </header>

        <main className="grid gap-6 md:grid-cols-3">
          <section className="space-y-4 md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              {["month", "week", "year"].map((range) => (
                <div
                  key={range}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {range === "month"
                      ? "This Month"
                      : range === "week"
                      ? "This Week"
                      : "This Year"}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income</span>
                      <span className="font-medium text-success">
                        {formatCurrency(summary[range]?.income || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expense</span>
                      <span className="font-medium text-danger">
                        {formatCurrency(summary[range]?.expense || 0)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2 text-xs">
                      <span className="text-slate-500">Net</span>
                      <span
                        className={`font-semibold ${
                          (summary[range]?.income || 0) -
                            (summary[range]?.expense || 0) >=
                          0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {formatCurrency(
                          (summary[range]?.income || 0) -
                            (summary[range]?.expense || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    History
                  </h2>
                  <p className="text-xs text-slate-500">
                    View and filter all income and expenses.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <select
                    name="division"
                    value={filters.division}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">All divisions</option>
                    <option value="personal">Personal</option>
                    <option value="office">Office</option>
                  </select>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">All categories</option>
                    <option value="food">Food</option>
                    <option value="fuel">Fuel</option>
                    <option value="movie">Movie</option>
                    <option value="loan">Loan</option>
                    <option value="medical">Medical</option>
                    <option value="salary">Salary</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    onClick={applyFilters}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="max-h-[380px] overflow-y-auto text-xs">
                <table className="min-w-full text-left">
                  <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Division</th>
                      <th className="px-3 py-2">Description</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                      <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 py-6 text-center text-slate-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 py-6 text-center text-slate-500"
                        >
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr
                          key={t._id}
                          className="border-t border-slate-100 hover:bg-slate-50/80"
                        >
                          <td className="px-3 py-2">
                            {new Date(t.occurredAt).toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                t.type === "income"
                                  ? "bg-green-50 text-success"
                                  : t.type === "expense"
                                  ? "bg-red-50 text-danger"
                                  : "bg-blue-50 text-primary-600"
                              }`}
                            >
                              {t.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-3 py-2 capitalize">
                            {t.category}
                          </td>
                          <td className="px-3 py-2 capitalize">
                            {t.division}
                          </td>
                          <td className="px-3 py-2">
                            {t.description || "-"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {t.type === "income" ? "+" : "-"}
                            {t.amount.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {isTransactionEditable(t) ? (
                              <button
                                onClick={() => handleEditTransaction(t)}
                                className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-600 hover:bg-blue-100"
                                title="Edit transaction (within 12 hours)"
                              >
                                Edit
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400" title="Cannot edit after 12 hours">
                                Locked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-2 text-sm font-semibold text-slate-800">
                Category Summary
              </h2>
              <p className="mb-3 text-xs text-slate-500">
                See which categories you spend or earn the most.
              </p>
              <div className="space-y-2 text-xs">
                {Object.keys(categoriesSummary).length === 0 ? (
                  <p className="text-slate-500">No data yet.</p>
                ) : (
                  Object.entries(categoriesSummary).map(
                    ([category, values]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                            {category}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Income:{" "}
                            <span className="font-medium text-success">
                              {values.income.toFixed(2)}
                            </span>{" "}
                            • Expense:{" "}
                            <span className="font-medium text-danger">
                              {values.expense.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <h2 className="mb-2 text-sm font-semibold text-slate-800">
                Tips
              </h2>
              <ul className="space-y-1 text-xs text-slate-500">
                <li>Use divisions to separate office vs personal expenses.</li>
                <li>Filter by date range to see spending between two dates.</li>
                <li>
                  You can only edit a transaction within 12 hours (enforced on
                  the backend).
                </li>
              </ul>
            </div>
          </aside>
        </main>

        <AddTransactionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
        />
      </div>
    </div>
  );
}

