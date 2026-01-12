import api from "./axios";

export const taskList = () => {
  return api.get("/api/tasks");
};

export const usersTaskList = () => {
  return api.get("/api/tasks/list");
};

export const taskStats = () => {
  return api.get("/api/tasks/stats");
};

export const addTask = (task) => {
  return api.post("/api/tasks/add", task);
};

export const editTask = (taskId, updatedTask) => {
  return api.put(`/api/tasks/edit/${taskId}`, updatedTask);
};

export const deleteTask = (taskId) => {
  return api.delete(`/api/tasks/delete/${taskId}`);
};
