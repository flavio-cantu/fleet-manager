import { Component, signal, ViewEncapsulation } from "@angular/core"
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../../services/auth.service"
import { SharedModule } from "../../../modules/shared/shared.module"
import { BackendError } from "../../../models/error.model"

@Component({
  selector: "page-signin",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
  encapsulation: ViewEncapsulation.None,

})
export class SignInPage {
  submitted = signal(false);

  loginForm: FormGroup

  submitting = false
  errorMessage?: BackendError | null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
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

    this.submitting = true
    const errors = [];

    if (this.loginForm.invalid) {
      errors.push('ERROR.FORM.INVALID');
    }


    if (errors.length != 0) {
      this.errorMessage = { frontErrors: errors };
      return;
    }

    const { email, password, remember } = this.loginForm.value

    this.authService.login(email, password, remember).subscribe({
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
