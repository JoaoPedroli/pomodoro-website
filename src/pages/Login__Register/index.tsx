import { useEffect, useState } from "react";
import { Form, FormControl, FormLabel } from "react-bootstrap";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";
import styles from "./styles.module.scss";

export const Login__Register = (props: { location: { search: string } }) => {
  const { createUserWithEmailAndPassword, signIn } = useAuth();
  const { theme } = usePomodoro();

  const [optionAuth, setOptionAuth] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const { search } = props.location;
    setOptionAuth(search.substring(1, search.length));
  }, [props.location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(optionAuth);

    setIsLoading(true);

    if (optionAuth === "signin") {
      await signIn(email, password);
    } else {
      await createUserWithEmailAndPassword({
        username,
        email,
        password,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <Form
        onSubmit={handleSubmit}
        className={styles.form + " container-box-shadow"}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1>{optionAuth === "signup" ? "Register" : "Login"}</h1>
            {optionAuth === "signup" && (
              <>
                <FormLabel>Username</FormLabel>
                <FormControl
                  required
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                />
              </>
            )}

            <FormLabel>Email</FormLabel>
            <FormControl
              required
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />

            <FormLabel>Password</FormLabel>
            <FormControl
              required
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />

            <button className={`${theme}-button`} type="submit">
              {optionAuth === "signup" ? "Register" : "Login"}
            </button>
          </>
        )}
      </Form>
    </div>
  );
};
