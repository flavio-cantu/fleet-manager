import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { CookieService } from '../cookie.service';

@Injectable({
  providedIn: 'root',
})
export class AuthHolder {
  private readonly TOKEN_KEY = 'X_TOKEN';

  private token: string | null = null;
  private user: User | null = null;

  constructor(private cookieService: CookieService) {}

  getToken(): string | null {
    if (!this.token) {
      this.token = this.cookieService.getCookie(this.TOKEN_KEY);
    }
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user ? user.roles!.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    return roles.some((role) => user.roles!.includes(role));
  }

  setToken(token: string) {
    this.token = token;
    this.cookieService.setCookie(this.TOKEN_KEY, token);
  }

  setUser(user: User) {
    this.user = user;
  }

  logout() {
    this.cookieService.deleteCookie(this.TOKEN_KEY);
    this.user = null;
    this.token = null;
  }
}
