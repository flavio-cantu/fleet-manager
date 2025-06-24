import { Component, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { LanguageSwitcherComponent } from "../../../components/language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"
import { InputFieldComponent } from "../../../components/input/app-input.component"
import { TranslatorService } from "../../../services/translator.service"

@Component({
  selector: "page-signin",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, LanguageSwitcherComponent, InputFieldComponent],
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
})
export class SignInPage {
  submitted = signal(false);

  loginForm: FormGroup

  loading = false
  errorMessage = ""

  constructor(
    private authService: AuthService,
    private router: Router,
    private translator: TranslatorService
  ) {
    //406 Not Acceptable

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/spaceships"])
    }

    // Initialize the reactive form
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      remember: new FormControl(true),
    })
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.loginForm.invalid) {
      return
    }

    this.loading = true
    this.errorMessage = ""

    const { email, password, remember } = this.loginForm.value

    this.authService.login(email, password, remember).subscribe({
      next: () => {
        this.router.navigate(["/spaceships"])
      },
      error: (errorCode) => {
        this.errorMessage = this.translator.translate(errorCode);
        this.loading = false
      },
      complete: () => {
        console.log('complete')
        this.loading = false
      },
    })
  }
}
