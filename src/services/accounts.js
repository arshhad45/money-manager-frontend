import API from "./api";

// Fetch all accounts
export const getAccounts = async () => {
  const res = await API.get("/api/accounts");
  return res.data;
};

// Create an account
export const createAccount = async (data) => {
  const res = await API.post("/api/accounts", data);
  return res.data;
};
