import API from "./api";

// Fetch summary statistics (month, week, year)
export const getSummary = async () => {
  const res = await API.get("/api/stats/summary");
  return res.data;
};
