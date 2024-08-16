import { handleError } from "../lib/errorHandler"
import { getCookie } from 'cookies-next';

export interface Res {
  success: boolean;
  status: number;
  resent: boolean;
  resend: Function;
  [key: string]: any;
}

class API {
  static token: string = "";

  static setToken(token: string) {
    this.token = token;
  }

  static getTokenFromCookies() {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie as string);
        this.token = user.token;
      } catch (error) {
        console.error('Error parsing cookie:', error);
      }
    }
  }
  
  static async get(
    path: string | string[],
    resent: boolean = false
  ): Promise<Res> {
    this.getTokenFromCookies();

    return new Promise(async (resolve, reject) => {
      if (Array.isArray(path)) path = path.join("/");
      
      let headers = new Headers();
      headers.append("Accept", "application/json");
      // headers.append("Content-Type", "application/json");
      // headers.append("Access-Control-Allow-Headers-Type", "x-requested-with, Content-Type, Origin, Authorization, accept, client-security-token");

      if (this.token) {
        headers.append("Authorization", `Bearer ${this.token}`);
      }

      const baseUrl =
      path.includes("search.json") || path.includes("catData.json")
        ? process.env.NEXT_PUBLIC_Shop_URL
        : process.env.NEXT_PUBLIC_API_URL;
    
      try {
        const response = await fetch(baseUrl+ path, {
          method: "GET",
          // credentials: "include",
          headers: headers,
        });

        const parsed = await this.parseRes(
          response,
          () => this.get(path, true),
          resent,
          path
        );

        resolve(parsed);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  static async post(
    path: string | string[],
    body: any,
    resent: boolean = false
  ): Promise<Res> {
    this.getTokenFromCookies();

    try {
      // Use the environment variable for the base URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const fullPath = `${baseUrl}${path}`;

      let headers = new Headers();
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");

      if (this.token) {
        headers.append("Authorization", `Bearer ${this.token}`);
      }

      const response = await fetch(fullPath, {
        method: "POST",
        // credentials: "include",
        // headers: headers,
        body: JSON.stringify(body),
      });

      const parsed = await response.json();

      if (!response.ok) {
        throw new Error(parsed.message || "An error occurred");
      }

      return parsed;
    } catch (error) {
      console.error("Error sending request:", error);
      throw error;
    }
  }


  static async parseRes(
    raw: Response,
    resend: Function,
    resent: boolean,
    path: string | string[]
  ): Promise<Res> {
    try {
      let res: Res = await raw.json();
      res.success = raw.status >= 200 && raw.status < 300;
      res.status = raw.status;
      res.resend = resend;
      res.resent = resent;

      if (!res.success) {
        console.log(res);
        // return await Error.handle(res, path);
      }

      return res;
    } catch (error) {
      console.error("Error parsing response:", error);
      throw handleError(error); // Rethrow the error to propagate it

    }
  }

}

export default API;
