import { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Col,
} from "react-bootstrap";

import styles from "./styles.module.scss";

import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";

export const Login__Register = (props) => {
  const { createUserWithEmailAndPassword, signIn } = useAuth();
  const { handleChangeStatus } = usePomodoro();

  const [optionAuth, setOptionAuth] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const resetThemeAndProcess = () => handleChangeStatus("start");

    resetThemeAndProcess();
  }, []);

  useEffect(() => {
    setOptionAuth(props.location.search.slice(1, 7));
  }, [props.location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (optionAuth === "signin") {
      await signIn(email, password);
    } else {
      await createUserWithEmailAndPassword({
        username,
        email,
        password,
      });
    }
  };

  return (
    <div className={styles.container}>
      <Form onSubmit={handleSubmit} className={styles.form}>
        {optionAuth === "signup" && (
          <FormGroup as={Col} className={styles.divGroup}>
            <FormLabel>Username</FormLabel>
            <FormControl
              required
              id={styles.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </FormGroup>
        )}
        <FormGroup as={Col} className={styles.divGroup}>
          <FormLabel>Email</FormLabel>
          <FormControl
            required
            id={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </FormGroup>
        <FormGroup as={Col} className={styles.divGroup}>
          <FormLabel>Password</FormLabel>
          <FormControl
            required
            id={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </FormGroup>
        <Button id={styles.button} type="submit">
          {optionAuth === "signin" ? "Login" : "Register"}
        </Button>
      </Form>
    </div>
  );
};
