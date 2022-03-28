import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "react-toastify";
import { getAuthErrorMessage } from "../database/authErrorMessages";
import firebase from "../database/firebaseConnection";

type UserSignedDataProps = {
	uid: string;
	email?: string;
	username?: string;
};

type UserDataProps = {
	email: string;
	password: string;
	username: string;
};

type AuthContextData = {
	isSigned: boolean;
	userData: UserSignedDataProps;
	username: string;
	email: string;
	isLoading: boolean;
	isLoadingAuth: boolean;
	createUserWithEmailAndPassword: (JSON: UserDataProps) => any;
	createUserWithGoogle: () => any;
	signIn: (email: string, password: string) => any;
	signOut: () => any;
};

type AuthContextProviderProps = {
	children: ReactNode;
};

export const AuthContext = createContext<AuthContextData | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
	const [userData, setUserData] = useState(null);
	const username = userData?.username;
	const email = userData?.email;

	const [isLoadingAuth, setIsLoadingAuth] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadStorage();

		function loadStorage() {
			const storageUserData = localStorage.getItem("UserData");

			if (storageUserData) setUserData(JSON.parse(storageUserData));

			setIsLoading(false);
		}
	}, []);

	const handleReturnErrorMessage = error => {
		if (error.code) {
			toast.error(getAuthErrorMessage(error.code));
		} else {
			toast.error(
				"Ops! Ocorreu um erro ao tentar executar esta tarefa, tente novamente mais tarde."
			);
		}
		console.log(error);
		setIsLoadingAuth(false);
	};

	const saveUserDataInLocalStorage = (userData: UserSignedDataProps) => {
		localStorage.setItem("UserData", JSON.stringify(userData));
	};

	const saveUserData = async (userData: UserSignedDataProps) => {
		const { uid, username, email } = userData;
		const isSigned = !username;
		if (isSigned) await saveUserSignedData();
		else await saveUserNotSignedData();

		function getFirebasePath() {
			return firebase.firestore().collection("users").doc(uid);
		}

		function redirectAndSendFeedback() {
			toast.success("Bem Vindo a plataforma!");
		}

		async function saveUserSignedData() {
			await getFirebasePath()
				.get()
				.then(userProfile => {
					const username = userProfile.data().username;
					userData.username = username;

					setUserData(userData);
					saveUserDataInLocalStorage(userData);
					redirectAndSendFeedback();
				})
				.catch(error => handleReturnErrorMessage(error));
		}

		async function saveUserNotSignedData() {
			await getFirebasePath()
				.set({
					username,
					email,
				})
				.then(() => {
					setUserData(userData);
					saveUserDataInLocalStorage(userData);
					redirectAndSendFeedback();
				})
				.catch(error => handleReturnErrorMessage(error));
		}
	};

	const createUserWithEmailAndPassword = async ({
		email,
		password,
		username,
	}: UserDataProps) => {
		setIsLoadingAuth(true);

		await firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(
				async ev =>
					await saveUserData({
						uid: ev.user.uid,
						email,
						username,
					})
			)
			.catch(error => handleReturnErrorMessage(error));

		setIsLoadingAuth(false);
	};

	const createUserWithGoogle = async () => {
		function createGoogleAuthProvider() {
			const provider = new firebase.auth.GoogleAuthProvider();

			provider.addScope(
				"https://www.googleapis.com/auth/contacts.readonly"
			);

			return provider;
		}

		return await firebase
			.auth()
			.signInWithPopup(createGoogleAuthProvider())
			.then(() => {})
			.catch(error => handleReturnErrorMessage(error));
	};

	const signIn = async (email: string, password: string) => {
		setIsLoadingAuth(true);

		await firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(async ev => {
				saveUserData({
					uid: ev.user.uid,
					email: ev.user.email,
				});
			})
			.catch(error => handleReturnErrorMessage(error));

		setIsLoadingAuth(false);
	};

	const signOut = async () => {
		try {
			await firebase.auth().signOut();
			localStorage.removeItem("UserData");
			setUserData(null);
		} catch (error) {
			return { error };
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isSigned: Boolean(userData),
				userData,
				username,
				email,
				isLoading,
				isLoadingAuth,
				createUserWithEmailAndPassword,
				createUserWithGoogle,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
