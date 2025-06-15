import { Component, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { SpaceshipService } from "../../../services/spaceship.service"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { NavComponent } from "../../../components/nav/nav.component"
import { InputFieldComponent } from "../../../components/input/app-input.component"
import { TranslatorService } from "../../../services/translator.service"

@Component({
  selector: "page-fleet-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavComponent, TranslateModule, InputFieldComponent],
  templateUrl: "./fleet-form.page.html",
  styleUrls: ["./fleet-form.page.scss"],
})
export class FleetFormPage {
  submitted = signal(false);

  spaceshipForm: FormGroup
  loading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private spaceshipService: SpaceshipService,
    private router: Router,
    private translator: TranslatorService
  ) {
    // Initialize the reactive form
    this.spaceshipForm = this.fb.group({
      name: ["", [Validators.required]],
      nickname: [""],
      quantity: [1, [Validators.required, Validators.min(1)]],
    })
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.spaceshipForm.invalid) {
      return
    }

    this.loading = true
    this.errorMessage = ""

    this.spaceshipService.addSpaceship(this.spaceshipForm.value).subscribe({
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
