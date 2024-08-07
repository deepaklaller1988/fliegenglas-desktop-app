import { useUser } from "../context/UserContext";

class User {
  static token: string = '';
  static isAdmin: boolean = false;
  static email: string = '';
  static username: string = '';
  static id: number | null = null;
  static userDetailsFetched: boolean = false;
  static isUserLoggedIn: boolean = false;

  static setUserDetails(user: any) {
    if (user) {
      this.token = user.token;
      this.email = user.email;
      this.username = user.username;
      this.id = user.id;
      this.userDetailsFetched = true;
      this.isUserLoggedIn = true;
    }
  }

  static role() {
    const { user }: any = useUser();
    if (user) {
      this.token = user.token;
      this.id = user?.id;
      this.email = user?.email;
      this.username = user.username;
      this.userDetailsFetched = user.userDetailsFetched;
      this.isUserLoggedIn = user.isUserLoggedIn;;
      return user;  
      }
    return user;   
  }

  static clearUserDetails() {
    const { clearUser }: any = useUser();
    clearUser();
    this.token = '';
    this.email = '';
    this.username = '';
    this.id = null;
    this.isAdmin = false;
    this.userDetailsFetched = false;
    this.isUserLoggedIn = false;
  }
}

export default User;
