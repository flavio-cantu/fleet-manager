import { Injectable } from "@angular/core"
import { map, Observable } from "rxjs"
import type { Auth, User } from "../models/user.model"
import { ApiService } from "./api.base.service";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly AUTH_KEY = 'auth-user';
  private readonly REMEMBER_DAYS = 30;
  private readonly NO_REMEMBER_EXPIRE = 1;

  public logedUser: User | null = null;


  constructor(private apiService: ApiService,
    private cookieService: CookieService
  ) {
  }

  login(email: string, password: string, remember: boolean): Observable<User> {
    return this.apiService.post<Auth>('login', { email, password }).pipe(
      map((auth: Auth) => {
        if (remember) {
          this.cookieService.setCookie(this.AUTH_KEY, JSON.stringify(auth), this.REMEMBER_DAYS);
        } else {
          this.cookieService.setCookie(this.AUTH_KEY, JSON.stringify(auth), this.NO_REMEMBER_EXPIRE);
        }
        return auth.user;
      })
    );
  }

  signup(user: User): Observable<User> {
    return this.apiService.post<Auth>('register', user).pipe(
      map((auth: Auth) => {
        this.cookieService.setCookie(this.AUTH_KEY, JSON.stringify(auth), this.NO_REMEMBER_EXPIRE);
        return auth.user;
      })
    );
  }

  logout(): void {
    this.logedUser = null;
    this.cookieService.deleteCookie(this.AUTH_KEY);
  }

  getCurrentUser(): User | null {
    if (!this.logedUser) {
      const auth: Auth = this.getAuth();
      if (auth.user) {
        this.logedUser = auth.user;
      }
    }
    return this.logedUser;
  }


  getToken() {
    return this.getAuth().accessToken;
  }

  deleteToken() {
    this.cookieService.deleteCookie(this.AUTH_KEY)
  }

  private getAuth(): Auth {
    const auth = this.cookieService.getCookie(this.AUTH_KEY);
    return JSON.parse(auth || '{}');
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  isAdmin(): boolean {
    return this.getAuth()?.user?.admin;
  }
}
