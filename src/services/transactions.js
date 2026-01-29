import API from "./api";

// Fetch all transactions
export const getTransactions = async (params = {}) => {
  const res = await API.get("/api/transactions", { params });
  return res.data;
};

// Create a transaction
export const createTransaction = async (data) => {
  const res = await API.post("/api/transactions", data);
  return res.data;
};

// Update transaction
export const updateTransaction = async (id, data) => {
  const res = await API.put(`/api/transactions/${id}`, data);
  return res.data;
};

// Delete transaction
export const deleteTransaction = async (id) => {
  const res = await API.delete(`/api/transactions/${id}`);
  return res.data;
};
