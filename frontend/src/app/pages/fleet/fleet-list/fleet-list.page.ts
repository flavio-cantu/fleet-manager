import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { NavComponent } from "../../../components/nav/nav.component"
import { CcuSpaceship, Spaceship } from "../../../models/spaceship.model"
import { SpaceshipService } from "../../../services/spaceship.service"
import { TranslatorService } from "../../../services/translator.service"

@Component({
  selector: "page-fleet-list",
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, TranslateModule],
  templateUrl: "./fleet-list.page.html",
  styleUrls: ["./fleet-list.page.scss"],
})
export class FleetListPage implements OnInit {
  spaceships: Spaceship[] = []
  ccuSpaceships: CcuSpaceship[] = []
  loading = true
  errorMessage = ""

  constructor(private spaceshipService: SpaceshipService,
    private translator: TranslatorService
  ) { }

  ngOnInit(): void {
    this.loadSpaceships()
  }

  loadSpaceships(): void {
    this.loading = true
    this.spaceshipService.getUserSpaceships().subscribe({
      next: (spaceships) => {
        this.spaceships = spaceships
        this.spaceshipService.getUserCCUSpaceships().subscribe({
          next: (ccu) => {
            this.ccuSpaceships = ccu;
            this.loading = false;
          },
          error: (errorCode) => {
            this.errorMessage = this.translator.translate(errorCode);
            this.loading = false
          }
        });
      },
      error: (errorCode) => {
        this.errorMessage = this.translator.translate(errorCode);
        this.loading = false
      },
    })
  }

  deleteSpaceship(id: string | undefined): void {
    this.spaceshipService.deleteSpaceship(id!!).subscribe({
      next: () => {
        this.loadSpaceships()
      },
      error: (errorCode) => {
        this.errorMessage = this.translator.translate(errorCode);
      },
    })
  }
}
