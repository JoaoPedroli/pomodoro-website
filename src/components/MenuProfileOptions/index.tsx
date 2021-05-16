import { useHistory } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import styles from "./styles.module.scss";
import Toast from "../Toast";

import { useAuth } from "../../contexts/authContext";

export const MenuProfileOptions = () => {
  const { signOut, username } = useAuth();
  const history = useHistory();

  const handleSignOut = () => {
    const confirm = window.confirm('Are you sure you want to sign out?');
    if(!confirm) return;

    const { error } = signOut();
    if (error) {
      Toast.error();
      console.log(error);
    } else {
      history.replace("/");
    }
  };

  const is = (page: string) => {
    return Boolean(history.location.pathname === page);
  }

  return <div className={styles.container}>
    <h2 style={{marginBottom: 20}}>Welcome {username}</h2>

    <div style={is('/dashboard') && {
      background: 'var(--primary-shadow)',
      color: 'var(--white)',
    }}>
      Dashboard
    </div>
    <div className={styles.divExit} onClick={handleSignOut}>
      Sign Out
      <FiLogOut style={{ marginLeft: 5}} />
    </div>
  </div>;
};
