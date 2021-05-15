import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

import { Routes } from "./routes";

import { AuthContextProvider } from './contexts/authContext';
import { PomodoroContextProvider } from "./contexts/pomodoroContext";

export const App = () => {
  return(
    <AuthContextProvider>
      <PomodoroContextProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000}/>
          <Routes/>
        </BrowserRouter>
      </PomodoroContextProvider>
    </AuthContextProvider>
  );
};
