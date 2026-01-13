import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { TaskContextProvider } from "./context/TaskContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <TaskContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </TaskContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
