import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";
import styles from "./styles.module.scss";

export const Header = () => {
	const { isSigned } = useAuth();
	const { useTheme, isStart } = usePomodoro();
	const history = useHistory();
	const [isHover, setIsHover] = useState(false);

	const toggleHover = () => setIsHover(!isHover);

	const handleRedirectToDashboard = () => {
		history.push("/dashboard");
	};

	const handleRedirectToSign = (optionAuth: string) => {
		history.push(`welcome?${optionAuth}`);
	};

	return (
		<div
			className={styles.container}
			style={{
				background: useTheme,
			}}
		>
			<span
				id="pointer"
				style={{ fontSize: 31 }}
				onClick={() => history.push("/")}
			>
				Pomodoro
			</span>

			{isSigned ? (
				<FiUser
					id="pointer"
					className={styles.userIcon}
					style={{ color: useTheme }}
					onClick={() => handleRedirectToDashboard()}
				/>
			) : (
				<div className={styles.auth}>
					<button
						className="primary-button"
						id={styles["login-txt"]}
						onMouseEnter={toggleHover}
						onMouseLeave={toggleHover}
						onClick={() => handleRedirectToSign("signin")}
						style={
							isHover
								? { color: useTheme }
								: { color: "var(--white)" }
						}
					>
						Login
					</button>

					<button
						className="primary-button"
						id={styles["signup-txt"]}
						style={{ color: useTheme }}
						onClick={() => handleRedirectToSign("signup")}
					>
						Sign Up
					</button>
				</div>
			)}
		</div>
	);
};
