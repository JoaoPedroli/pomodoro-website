import { useEffect, useState } from "react";
import { MenuProfileOptions } from "../../components/MenuProfileOptions";
import styles from "./styles.module.scss";
import firebase from "../../database/firebaseConnection";
import { Form, FormControl, FormLabel } from "react-bootstrap";
import { Loader } from "../../components/Loader";
import { usePomodoro } from "../../contexts/pomodoroContext";
import Toast from "../../components/Toast";

export const Settings = () => {
  const { theme } = usePomodoro();

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const getUid = () => JSON.parse(localStorage.getItem("UserData")).uid;

  useEffect(() => {
    fetchData();

    async function fetchData() {
      await firebase
        .firestore()
        .collection("users")
        .doc(getUid())
        .get()
        .then((e) => {
          const data = e.data();
          setUsername(data.username);
          setEmail(data.email);
        });
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = async(e) => {
    e.preventDefault();
    await firebase.firestore().collection("users").doc(getUid()).update({
      username, email,
    }).then(() => Toast.success("Informações editadas com sucesso!!"));
  };

  return (
    <div className={styles.container}>
      <MenuProfileOptions />

      <div className={styles.subcontainer}>
        {isLoading ? (
          <Loader />
        ) : (
          <Form onSubmit={handleUpdate}>
            <FormLabel>Username</FormLabel>
            <FormControl required value={username} onChange={e => setUsername(e.target.value)} />

            <FormLabel>Email</FormLabel>
            <FormControl required value={email} onChange={e => setEmail(e.target.value)} />

            <button type="submit" className={`${theme}-button`}>Editar</button>
          </Form>
        )}
      </div>
    </div>
  );
};
