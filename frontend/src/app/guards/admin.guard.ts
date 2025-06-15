import { Injectable } from "@angular/core"
import { CanActivate, Router, UrlTree } from "@angular/router"
import { Observable } from "rxjs"
import { AuthService } from "../services/auth.service"

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAdmin()) {
      return true
    }

    // Not logged in so redirect to login page
    return this.router.parseUrl("/401")
  }
}
