import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'page-wait-approval-page',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="error-container">
      <h1 class="text-success">{{'ERROR.PAGE.WAIT_APPROVAL'|translate}}</h1>
      <p>{{'ERROR.PAGE.WAIT_APPROVAL_DESCRIPTION'|translate}}</p>
      <p>
        <a routerLink="/login" class="home-link">{{'ERROR.PAGE.RETURN_LOGIN'|translate}}</a>
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
      font-size: 2.5rem;
    }
    a {
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
      &:hover {
        text-decoration: underline;
      }
    }
  `]
})
export class WaitForApprovalPage { }