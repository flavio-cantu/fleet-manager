import { Component, signal } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { SpaceshipService } from "../../../services/spaceship.service";
import { ManagerModule } from "../../../fleet-manager.module";
import { BackendError } from "../../../../../models/error.model";


@Component({
  selector: "page-fleet-form",
  standalone: true,
  imports: [ManagerModule],
  templateUrl: "./fleet-form.page.html",
  styleUrls: ["./fleet-form.page.scss"],
})
export class FleetFormPage {
  submitted = signal(false);

  avaliableShips: string[] = [];

  spaceshipForm: FormGroup
  loading = false
  submitting = false
  errorMessage?: BackendError | null;

  constructor(
    private fb: FormBuilder,
    private spaceshipService: SpaceshipService,
    private router: Router,
  ) {
    // Initialize the reactive form
    this.spaceshipForm = this.fb.group({
      name: ["", [Validators.required]],
      nickname: [""],
      quantity: [1, [Validators.required, Validators.min(1)]],
    })

    this.loading = true;
    this.spaceshipService.loadShipNames().subscribe({
      next: (ships) => {
        this.avaliableShips = ships;
        this.loading = false;
      },
      error: (errors) => {
        this.errorMessage = errors;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.spaceshipForm.invalid) {
      return
    }

    this.submitting = true

    this.spaceshipService.addSpaceship(this.spaceshipForm.value).subscribe({
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.avaliableShips.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
