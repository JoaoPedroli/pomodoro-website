import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./contexts/authContext";
import { PomodoroContextProvider } from "./contexts/pomodoroContext";
import { Routes } from "./routes";

export const App = () => {
  return (
    <AuthContextProvider>
      <PomodoroContextProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000} />
          <Routes />
        </BrowserRouter>
      </PomodoroContextProvider>
    </AuthContextProvider>
  );
};
