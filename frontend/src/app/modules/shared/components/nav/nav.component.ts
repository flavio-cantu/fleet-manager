import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"
import { AuthService } from "../../../../services/auth.service"

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LanguageSwitcherComponent],
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  get currentUser() {
    return this.authService.getCurrentUser();
  }


  logout(): void {
    this.authService.logout()
    this.router.navigate(["/login"])
  }

  get isAdmin() {
    return this.currentUser?.admin;
  }


}
