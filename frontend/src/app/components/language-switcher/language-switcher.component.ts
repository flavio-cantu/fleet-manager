import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateService } from "@ngx-translate/core"

@Component({
  selector: "app-language-switcher",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown">
      <button class="btn btn-sm btn-outline-light dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        {{ currentLang === 'en' ? 'English' : 'Português' }}
      </button>
      <ul class="dropdown-menu" aria-labelledby="languageDropdown">
        <li><a class="dropdown-item" href="#" (click)="changeLanguage('en'); $event.preventDefault()">English</a></li>
      </ul>
    </div>
  `,
  styles: [],
})
export class LanguageSwitcherComponent {
  currentLang: string

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || "en"
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang)
    this.currentLang = lang
  }
}
