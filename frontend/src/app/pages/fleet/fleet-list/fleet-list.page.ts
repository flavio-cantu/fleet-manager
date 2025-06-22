import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { NavComponent } from "../../../components/nav/nav.component"
import { CcuSpaceship, Spaceship } from "../../../models/spaceship.model"
import { SpaceshipService } from "../../../services/spaceship.service"
import { TranslatorService } from "../../../services/translator.service"
import { AuthService } from "../../../services/auth.service"

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
    private translator: TranslatorService,
    private authService: AuthService,
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

  get isAdmin() {
    return this.authService.getCurrentUser()?.admin;
  }

  downloadFleetView(type: string) {
    this.spaceshipService.downloadFleet(type).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'fleetview.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro no download:', error);
      }
    });
  }


}
