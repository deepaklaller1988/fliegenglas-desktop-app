export const handleError = (errorMessage: any) => {
  switch (errorMessage) {
    case "ERR_AUTH_WRONG_USERNAME_OR_PASSWORD":
      return "Wrong Email";
    case "ERR_AUTH_USER_NOT_FOUND":
      return "User not found.";
    case "ERR_AUTH_USER_LOCKED":
      return "User account is locked.";
    case "ERR_AUTH_USERNAME":
      return "Username already Exist";
    case "ERR_AUTH_WRONG_TOKEN":
      return "Oops! Looks like this link has expired. Please request a fresh one. ";
    case "Email Not Found":
      return "Email Not Found";
    case "Password Not Matched":
      return "Wrong Password";
    default:
      return "An error occurred. Please try again.";
  }
};
