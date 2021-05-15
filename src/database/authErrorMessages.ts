export const getAuthErrorMessage = (errorCode: string) => {
  let errorMessage = '';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      errorMessage = 'Already exists an account with the given email address.';
    break;

    case 'auth/invalid-email':
      errorMessage = 'The email address is not valid.';
    break;

    case 'auth/operation-not-allowed':
      errorMessage = 'Email/Password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.';
    break;

    case 'auth/weak-password':
      errorMessage = 'The password is not strong enough.';
    break;

    case 'auth/user-disabled':
      errorMessage = 'The user corresponding to the given email has been disabled.';
    break;

    case 'auth/user-not-found':
      errorMessage = 'There is no user corresponding to the given email.';
    break;

    case 'auth/wrong-password':
      errorMessage = 'The password is invalid.';
    break;

    default:
      errorMessage = errorCode;
    break;
  }

  return errorMessage;
}
