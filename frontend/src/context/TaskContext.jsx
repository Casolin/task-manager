import { createContext, useState } from "react";
import {
  addTask,
  deleteTask,
  editTask,
  taskList,
  taskStats,
} from "../api/tasks";

const TaskContext = createContext(null);

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserTaskList = async () => {
    try {
      setLoading(true);
      const response = await taskList();
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const getUserTaskStats = async () => {
    try {
      setLoading(true);
      const response = await taskStats();
      setTaskState(response.data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUserTask = async (task) => {
    try {
      setLoading(true);
      const response = await addTask(task);
      setTasks((prev) => [...prev, response.data]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const editUserTask = async (taskId, updatedTask) => {
    try {
      setLoading(true);
      const modifiedTask = await editTask(taskId, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id !== taskId ? task : modifiedTask))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to manage task");
    }
  };

  const deleteUserTask = async (taskId) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to manage task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        getUserTaskStats,
        getUserTaskList,
        addUserTask,
        editUserTask,
        deleteUserTask,
        taskState,
        loading,
        error,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
