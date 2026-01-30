import React, { useState } from "react";
import { createAccount } from "../services/accounts";

const accountTypes = ["cash", "bank", "card", "other"];

export default function AccountManagement({ accounts = [], onAccountCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", type: "cash", balance: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "balance" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Account name is required");
      return;
    }

    try {
      setLoading(true);
      await createAccount(form);
      setForm({ name: "", type: "cash", balance: 0 });
      setIsModalOpen(false);
      if (onAccountCreated) {
        onAccountCreated();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Accounts</h2>
          <p className="text-xs text-slate-500">Manage your accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-500"
        >
          + Add Account
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {accounts.length === 0 ? (
          <p className="text-center text-slate-500">No accounts yet. Create one to get started.</p>
        ) : (
          accounts.map((account) => (
            <div
              key={account._id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
            >
              <div>
                <div className="text-[11px] font-semibold text-slate-700">
                  {account.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {account.type}
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-800">
                {formatCurrency(account.balance)}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-800">Add Account</h2>
              <button
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                onClick={() => {
                  setIsModalOpen(false);
                  setForm({ name: "", type: "cash", balance: 0 });
                  setError("");
                }}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Account Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="e.g., Savings Account, Cash, Credit Card"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {accountTypes.map((type) => (
                      <option key={type} value={type}>
                        {type[0].toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Initial Balance
                  </label>
                  <input
                    type="number"
                    name="balance"
                    value={form.balance}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setForm({ name: "", type: "cash", balance: 0 });
                    setError("");
                  }}
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
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
