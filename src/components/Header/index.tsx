import { useState } from "react";
import { useHistory } from "react-router-dom";
import { FiUser } from "react-icons/fi";

import styles from "./styles.module.scss";

import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";

export const Header = () => {
  const { isSigned } = useAuth();
  const { theme, isStart } = usePomodoro();
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);

  const toggleHover = () => setIsHover(!isHover);

  const handleVerifAndConfirmRedirect = (optionAuth?: string): boolean => {
    if (isStart) return true;

    const confirm = window.confirm(
      `Do you really want to ${
        isSigned
          ? "see your profile"
          : `${optionAuth === "signin" ? "login" : "register"}`
      } now? You will lose all current process.`
    );

    return Boolean(confirm);
  };

  const handleRedirectToDashboard = () => {
    history.push("/dashboard");
  };

  const handleRedirectToSign = (optionAuth: string) => {
    history.push(`welcome?${optionAuth}`);
  };

  return (
    <div
      className={styles.container}
      style={{
        background: theme,
      }}
    >
      <span
        id="pointer"
        style={{ fontSize: 31 }}
        onClick={() => history.push("/")}
      >
        Pomodoro
      </span>

      {isSigned ? (
        <FiUser
          id="pointer"
          className={styles.userIcon}
          style={{ color: theme }}
          onClick={() => handleRedirectToDashboard()}
        />
      ) : (
        <div className={styles.auth}>
          <button
            id={styles.login}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            onClick={() => handleRedirectToSign("signin")}
            style={isHover ? { color: theme } : { color: "var(--white)" }}
          >
            Login
          </button>

          <button
            id={styles.signup}
            style={{ color: theme, transition: "all 1s" }}
            onClick={() => handleRedirectToSign("signup")}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};
