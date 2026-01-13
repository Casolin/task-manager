import api from "./axios";

export const getUsers = () => {
  return api.get("/api/users");
};

export const deleteUser = (userId) => {
  return api.delete(`/api/users/delete/${userId}`);
};
