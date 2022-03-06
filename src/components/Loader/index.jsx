import { Puff, useLoading } from "@agney/react-loading";
import { usePomodoro } from "../../contexts/pomodoroContext";

import styles from "./styles.module.scss";

export const Loader = ({ size = "60", color = "" }) => {
  const { theme } = usePomodoro();

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width={size} color={color ?? theme} />,
  });

  return (
    <section {...containerProps} className={styles.container}>
      {indicatorEl}
    </section>
  );
};
