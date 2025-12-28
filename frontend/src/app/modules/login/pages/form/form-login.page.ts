import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModule } from '../../login.module';
import { BackendError } from '../../../../models/domain/error.model';
import { LoginService } from '../../services/login.service';
import { ToastService } from '../../../../services/toast.service';
import { AuthHolder } from '../../../../services/auth/auth.holder';


@Component({
  selector: 'page-form-login',
  standalone: true,
  imports: [LoginModule],
  templateUrl: './form-login.page.html',
})
export class LoginFormPage implements OnInit {
  private returnUrl = null;
  submitted = signal(false);

  form: FormGroup;
  charging = false;
  submitting = false;
  errorMessage?: BackendError | null;

  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private authHolder: AuthHolder
  ) {
    // Initialize the reactive form
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    this.submitted.set(true);
    const errors = [];

    if (this.form.invalid) {
      errors.push('LOGIN.FORM.ERROR.INVALID');
    }

    if (errors.length != 0) {
      this.errorMessage = { frontErrors: errors };
      this.toastService.pushFrontendError('LOGIN.FORM.TOAST.ERROR_SAVE');
      return;
    }

    this.submitting = true;
    this.login();
  }

  login() {
    this.loginService.login(this.form.value).subscribe({
      next: loginResponse => {        
        if(loginResponse.token){
          this.authHolder.setToken(loginResponse.token);
        }
        if(loginResponse.message){
        this.toastService.pushWarning(loginResponse.message);  
        }else{
        this.toastService.pushInfo('LOGIN.FORM.TOAST.SUCCESS');
        this.router.navigate([this.returnUrl]);
        }
      },
      error: (errors) => {
        this.toastService.pushFrontendError('LOGIN.FORM.TOAST.ERROR_SAVE');
        this.errorMessage = errors;
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

}
