import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.base.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { httpAuthInterceptor } from './services/interceptor/interceptor.auth';
import { httpErrorInterceptor } from './services/interceptor/interceptor.error';
import { TranslatorService } from './services/translator.service';
import { CookieService } from './services/cookie.service';
import { provideEnvironmentNgxMask } from 'ngx-mask';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json")
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  importProvidersFrom(
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: "en",
    }),
  ),
  provideHttpClient(
    withInterceptors([httpErrorInterceptor, httpAuthInterceptor])
  ),
  provideAnimations(),
  provideEnvironmentNgxMask(),
    ApiService,
    TranslatorService,
    CookieService
  ]
};
