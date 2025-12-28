import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedModule } from './modules/shared/shared.module';
import { ModalService } from './modules/shared/components/modal/modal.service';
import { filter } from 'rxjs';
import { AuthHolder } from './services/auth/auth.holder';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public static readonly CONTEXT_CLIENT_REFRESH_TIME = 1000;

  showContent = true;

  constructor(
    translate: TranslateService,
    private modalService: ModalService,
    private authHolder: AuthHolder,
    router: Router
  ) {
    // Set default language
    translate.setDefaultLang('pt');
    translate.use('pt');

    //FIX memory scroll
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.showContent = false;
      setTimeout(() => {
        this.showContent = true;
      }, 0);
    });
  }

  reload() {
    this.showContent = false;
    const modal = this.modalService.loading();
    setTimeout(() => {
      this.showContent = true;
      modal.close();
    }, AppComponent.CONTEXT_CLIENT_REFRESH_TIME);
  }

  get loggedIn(): boolean {
    return this.authHolder.isAuthenticated();
  }

  getPageMargin() {
    if (!this.loggedIn) {
      return '0px';
    }
    return '60px';
  }
}
