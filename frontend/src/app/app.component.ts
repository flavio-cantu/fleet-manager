import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { TranslateService } from "@ngx-translate/core"
import { SharedModule } from "./modules/shared/shared.module"
import { AuthService } from "./services/auth.service"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(translate: TranslateService, private authService: AuthService) {
    translate.setDefaultLang("en")
    translate.use("en")
  }

  showMenu(): boolean {
    return this.authService.isLoggedIn();
  }
}

