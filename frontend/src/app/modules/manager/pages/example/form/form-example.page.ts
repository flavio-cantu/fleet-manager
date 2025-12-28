import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerModule } from '../../../manager.module';
import { BackendError } from '../../../../../models/domain/error.model';
import { ClientDetailResponse } from '../../../../../models/example.model';
import { CpfCnpjValidator } from '../../../../shared/validator/cpf-cnpj.validator';
import { ToastService } from '../../../../../services/toast.service';
import { ExampleService } from '../../../services/example.service';

@Component({
  selector: 'page-form-example',
  standalone: true,
  imports: [ManagerModule],
  templateUrl: './form-example.page.html',
  styleUrls: ['./form-example.page.scss'],
})
export class ExampleFormPage implements OnInit {
  submitted = signal(false);

  form: FormGroup;
  charging = false;
  submitting = false;
  errorMessage?: BackendError | null;

  clientId?: number;

  constructor(
    private fb: FormBuilder,
    private clientService: ExampleService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    // Initialize the reactive form
    this.form = this.fb.group({
      businessName: ['', [Validators.required, Validators.maxLength(100)]],
      cnpj: [
        '',
        [
          Validators.required,
          CpfCnpjValidator.validate(),
          Validators.maxLength(14),
        ],
      ],
      responsibleName: ['', [Validators.required, Validators.maxLength(100)]],
      responsibleCpf: [
        '',
        [
          Validators.required,
          CpfCnpjValidator.validate(),
          Validators.maxLength(11),
        ],
      ],
      suframa: ['', [Validators.maxLength(9)]],
      fantasyName: ['', [Validators.required, Validators.maxLength(60)]],
      phone: ['', [Validators.maxLength(11)]],
      fax: ['', [Validators.maxLength(11)]],
      email: ['', [Validators.maxLength(60)]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.clientId = idParam ? +idParam : undefined;
    if (this.clientId) {
      this.charging = true;
      this.clientService.getClient(this.clientId).subscribe({
        next: (client) => {
          this.setFormData(client);
        },
        error: (errors) => {
          this.toastService.pushFrontendError('EXAMPLE.FORM.TOAST.LOAD_ERROR');
          this.errorMessage = errors;
          this.charging = false;
        },
        complete: () => {
          this.charging = false;
        },
      });
    }
  }

  private setFormData(client: ClientDetailResponse): void {
    this.form.get('businessName')?.setValue(client.businessName);
    this.form.get('cnpj')?.setValue(client.cnpj);
    this.form.get('responsibleName')?.setValue(client.responsibleName);
    this.form.get('responsibleCpf')?.setValue(client.responsibleCpf);
    this.form.get('suframa')?.setValue(client.suframa);
    this.form.get('fantasyName')?.setValue(client.fantasyName);
    this.form.get('phone')?.setValue(client.phone);
    this.form.get('fax')?.setValue(client.fax);
    this.form.get('email')?.setValue(client.email);
  }

  onSubmit(): void {
    this.submitted.set(true);
    const errors = [];

    if (this.form.invalid) {
      errors.push('EXAMPLE.FORM.ERROR.INVALID');
    }

    if (errors.length != 0) {
      this.errorMessage = { frontErrors: errors };
      this.toastService.pushFrontendError('EXAMPLE.FORM.TOAST.ERROR_SAVE');
      return;
    }

    this.submitting = true;

    if (this.clientId) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.clientService.addClient(this.form.value).subscribe({
      next: () => {
        this.toastService.pushInfo('EXAMPLE.FORM.TOAST.SUCCESS');
        this.router.navigate(['/client']);
      },
      error: (errors) => {
        this.toastService.pushFrontendError('EXAMPLE.FORM.TOAST.ERROR_SAVE');
        this.errorMessage = errors;
        this.submitting = false;
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  update() {
    this.clientService
      .updateClient(this.clientId!!, this.form.value)
      .subscribe({
        next: () => {
          this.toastService.pushInfo('EXAMPLE.FORM.TOAST.SUCCESS');
          this.router.navigate(['/client']);
        },
        error: (errors) => {
          this.toastService.pushFrontendError('EXAMPLE.FORM.TOAST.ERROR_SAVE');
          this.errorMessage = errors;
          this.submitting = false;
        },
        complete: () => {
          this.submitting = false;
        },
      });
  }
}
