import styles from "./styles.module.scss";

export const NotFoundError = () => {
	return (
		<div className={styles.container}>
			<p>Error 404</p>
		</div>
	);
};
