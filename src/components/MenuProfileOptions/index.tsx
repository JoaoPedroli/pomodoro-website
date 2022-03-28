import { FiHelpCircle, FiLogOut, FiPieChart, FiSettings } from "react-icons/fi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { usePomodoro } from "../../contexts/pomodoroContext";
import Toast from "../Toast";
import styles from "./styles.module.scss";

export const MenuProfileOptions = () => {
	const { signOut, username } = useAuth();
	const { theme } = usePomodoro();
	const history = useHistory();

	const pageOptions = [
		{
			name: "Dashboard",
			icon: <FiPieChart />,
			route: "/dashboard",
		},
		{
			name: "Rank",
			icon: <MdOutlineLeaderboard />,
			route: "/leaderboard",
		},
		{
			name: "Settings",
			icon: <FiSettings />,
			route: "/settings",
		},
		{
			name: "Suport",
			icon: <FiHelpCircle />,
			route: "/suport",
		},
		{
			isSignOut: true,
			name: "Sign Out",
			icon: <FiLogOut />,
		},
	];

	const handleSignOut = () => {
		const confirm = window.confirm("Are you sure you want to sign out?");
		if (!confirm) return;

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
	};

	return (
		<div className={styles.container}>
			<h2 style={{ marginBottom: 20 }}>Welcome, {username}!</h2>

			{pageOptions.map(({ isSignOut, name, icon, route }) => (
				<div
					key={name}
					className={
						isSignOut
							? styles.divExit
							: is(route)
							? styles[`active-page-option-${theme}`]
							: styles[`page-option-${theme}`]
					}
					onClick={() =>
						isSignOut ? handleSignOut() : history.push(route)
					}
				>
					<span style={{ marginRight: 10 }}>{icon}</span>

					<span>{name}</span>
				</div>
			))}
		</div>
	);
};
