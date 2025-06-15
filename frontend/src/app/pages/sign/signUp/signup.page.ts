import { Component, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { LanguageSwitcherComponent } from "../../../components/language-switcher/language-switcher.component"
import { TranslateModule } from "@ngx-translate/core"
import { InputFieldComponent } from "../../../components/input/app-input.component"
import { TranslatorService } from "../../../services/translator.service"

@Component({
  selector: "page-signup",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, LanguageSwitcherComponent, InputFieldComponent],
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage {
  signupForm: FormGroup

  submitted = signal(false);

  loading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translator: TranslatorService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/login"])
    }

    // Initialize the form
    this.signupForm = this.fb.group({
      nickname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    })
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.signupForm.invalid) {
      return
    }

    const { password, confirmPassword } = this.signupForm.value
    if (password !== confirmPassword) {
      this.errorMessage = this.translator.translate("SIGNUP.PASSWORDS_DONT_MATCH")
      return
    }

    this.loading = true
    this.errorMessage = ""

    this.authService
      .signup(this.signupForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(["/spaceships"])
        },
        error: (errorCode) => {
          this.errorMessage = this.translator.translate(errorCode);
          this.loading = false
        },
        complete: () => {
          this.loading = false
        },
      })
  }
}
