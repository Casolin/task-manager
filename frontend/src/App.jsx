import ProtectedRoute from "./ProtectedRoute";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { TaskList } from "./components/tasks/TaskList";
import { UsersTaskList } from "./components/tasks/UsersTaskList";

import "./styles/index.css";

import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";

import { DashboardContent } from "./pages/dashboard/DashboardContent";

// import { motion } from "framer-motion";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            index
            element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="tasks"
            element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="list"
            element={
              <ProtectedRoute>
                <UsersTaskList />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
        <Route
          path="/"
          element={<Navigate to={"/"} replace></Navigate>}
        ></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      ></ToastContainer>
    </Router>
  );
}

export default App;
