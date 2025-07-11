import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { TranslateService } from "@ngx-translate/core"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang("en")
    translate.use("en")
  }
}

