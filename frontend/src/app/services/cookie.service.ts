import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class CookieService {

  setCookie(name: string, value: string, days?: number, path: string = '/'): void {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      cookie += `; expires=${date.toUTCString()}`;
    }

    cookie += `; path=${path}`;

    // Adiciona Secure e SameSite em HTTPS
    if (window.location.protocol === 'https:') {
      cookie += '; Secure; SameSite=Strict';
    }

    document.cookie = cookie;
  }


  getCookie(name: string): string | null {
    const cookies = `; ${document.cookie}`;
    const parts = cookies.split(`; ${encodeURIComponent(name)}=`);

    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
  }

  deleteCookie(name: string, path: string = '/'): void {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;

    // Limpar também em caso de HTTPS
    if (window.location.protocol === 'https:') {
      document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; Secure; SameSite=Strict`;
    }
  }

}
