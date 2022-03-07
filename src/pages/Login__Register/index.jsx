import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";
import styles from "./styles.module.scss";

export const Login__Register = (props) => {
  const { createUserWithEmailAndPassword, signIn } = useAuth();
  const { handleChangeStatus } = usePomodoro();

  const [optionAuth, setOptionAuth] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setOptionAuth(props.location.search);
  }, [props.location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(optionAuth);

    if (optionAuth === "?signin") {
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
        {optionAuth === "?signup" && (
          <FormGroup as={Col} className={styles.divGroup}>
            <FormLabel>Username</FormLabel>
            <FormControl
              required
              name="username"
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
            name="email"
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
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </FormGroup>

        <Button type="submit">
          {optionAuth === "?signin" ? "Login" : "Register"}
        </Button>
      </Form>
    </div>
  );
};
