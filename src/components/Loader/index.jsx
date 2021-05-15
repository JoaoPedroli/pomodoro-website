import { Puff, useLoading } from "@agney/react-loading";
import { usePomodoro } from "../../contexts/pomodoroContext";

import styles from "./styles.module.scss";

export const Loader = (props) => {
  const { size, color } = props;
  const { theme } = usePomodoro();

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Puff width={size ?? "60"} color={color ?? theme} />,
  });

  return (
    <section {...containerProps} className={styles.container}>
      {indicatorEl}
    </section>
  );
};
