import api from "./axios";

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};

export const loginUser = (userData) => {
  return api.post("/api/auth/login", userData);
};

export const getProfile = () => {
  return api.get("/api/auth/profile");
};

export const updatePfpApi = (pfpBase64) =>
  api.patch("/api/auth/user/pfp", { pfp: pfpBase64 });
