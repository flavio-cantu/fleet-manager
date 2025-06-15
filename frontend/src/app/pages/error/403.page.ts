import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'page-unauthorized-page',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="error-container">
      <h1>403 - {{'ERRO.PAGE.UNAUTHORIZED'|translate}}</h1>
      <p>{{'ERRO.PAGE.UNAUTHORIZED_DESCRIPTION'|translate}}</p>
      <p>
        <a routerLink="/" class="home-link">{{'ERRO.PAGE.RETURN'|translate}}</a>
      </p>
    </div>
  `,
  styles: [`
    .error-container {
      text-align: center;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #d32f2f;
      font-size: 2.5rem;
    }
    .home-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class UnauthorizedPage { }