import React, { useState, useEffect } from "react";
import { createTransaction, updateTransaction } from "../services/transactions";

const defaultForm = {
  type: "income",
  amount: "",
  description: "",
  category: "",
  division: "personal",
  occurredAt: "",
};

const categories = [
  "salary",
  "food",
  "fuel",
  "movie",
  "loan",
  "medical",
  "shopping",
  "other",
];

export default function AddTransactionModal({ open, onClose, onSave, transaction = null }) {
  const isEditMode = !!transaction;
  const [activeTab, setActiveTab] = useState("income");
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form when editing
  useEffect(() => {
    if (transaction) {
      const dateTime = new Date(transaction.occurredAt);
      const localDateTime = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setForm({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description || "",
        category: transaction.category || "",
        division: transaction.division || "personal",
        occurredAt: localDateTime,
      });
      setActiveTab(transaction.type);
    } else {
      setForm({ ...defaultForm });
      setActiveTab("income");
    }
    setError("");
  }, [transaction, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      type: activeTab,
      amount: Number(form.amount),
      occurredAt: form.occurredAt
        ? new Date(form.occurredAt).toISOString()
        : new Date().toISOString(),
    };

    try {
      setLoading(true);
      
      if (isEditMode) {
        await updateTransaction(transaction._id, payload);
      } else {
        await createTransaction(payload);
      }

      // Notify parent (for refresh)
      if (onSave) {
        onSave(payload);
      }

      setForm({ ...defaultForm });
      setActiveTab("income");
      onClose();
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 
        (isEditMode ? "Failed to update transaction. It may be older than 12 hours." : "Failed to save transaction. Please try again.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="flex border-b px-6">
          <button
            className={`flex-1 border-b-2 py-2 text-center text-sm font-medium ${
              activeTab === "income"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("income")}
            disabled={loading}
          >
            Income
          </button>
          <button
            className={`flex-1 border-b-2 py-2 text-center text-sm font-medium ${
              activeTab === "expense"
                ? "border-red-600 text-red-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("expense")}
            disabled={loading}
          >
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="occurredAt"
                value={form.occurredAt}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Description
            </label>
            <input
              type="text"
              name="description"
              maxLength={80}
              value={form.description}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c[0].toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Division
              </label>
              <select
                name="division"
                value={form.division}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="personal">Personal</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
