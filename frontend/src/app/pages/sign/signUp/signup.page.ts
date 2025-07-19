import { Component, signal, ViewEncapsulation } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { TranslatorService } from "../../../services/translator.service"
import { SharedModule } from "../../../modules/shared/shared.module"
import { BackendError } from "../../../models/error.model"

@Component({
  selector: "page-signup",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SignupPage {
  signupForm: FormGroup

  submitted = signal(false);

  submitting = false
  errorMessage?: BackendError | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translator: TranslatorService
  ) {
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


    const errors = [];
    if (this.signupForm.invalid) {
      errors.push('ERROR.FORM.INVALID');
    }

    const { password, confirmPassword } = this.signupForm.value
    if (password !== confirmPassword) {
      errors.push('SIGNUP.PASSWORDS_DONT_MATCH');
    }

    if (errors.length != 0) {
      this.errorMessage = { frontErrors: errors };
      return;
    }

    this.submitting = true

    this.authService
      .signup(this.signupForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(["/spaceships"])
        },
        error: (errors) => {
          this.errorMessage = errors;
          this.submitting = false
        },
        complete: () => {
          this.submitting = false
        },
      })
  }
}
