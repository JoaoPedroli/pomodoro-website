import { Redirect, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import { Loader } from "./components/Loader";
import { useAuth } from "./contexts/authContext";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Login__Register } from "./pages/Login__Register";
import { NotFoundError as Error } from "./pages/NotFoundError";
import styles from "./styles/app.module.scss";

export const Routes = () => {
  const { isSigned, isLoading } = useAuth();

  const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isSigned ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );

  const NoAuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        !isSigned ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "*", state: { from: props.location } }} />
        )
      }
    />
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <NoAuthenticatedRoute
          exact
          path="/welcome"
          component={Login__Register}
        />
        <AuthenticatedRoute exact path="/dashboard" component={Dashboard} />
        <Route path="*" component={Error} />
      </Switch>
    </div>
  );
};
