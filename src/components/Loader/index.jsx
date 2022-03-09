import { Puff, useLoading } from "@agney/react-loading";
import { usePomodoro } from "../../contexts/pomodoroContext";

import styles from "./styles.module.scss";

export const Loader = ({ size = "60", color = "" }) => {
  const { useTheme } = usePomodoro();

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width={size} />,
  });

  return (
    <section {...containerProps} className={styles.container} style={{color:useTheme}}>
      {indicatorEl}
    </section>
  );
};
