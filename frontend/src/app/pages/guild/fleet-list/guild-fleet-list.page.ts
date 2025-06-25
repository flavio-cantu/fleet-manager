import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TranslateModule } from "@ngx-translate/core"
import { NavComponent } from "../../../components/nav/nav.component"
import { GuildSpaceship } from "../../../models/spaceship.model"
import { SpaceshipService } from "../../../services/spaceship.service"
import { TranslatorService } from "../../../services/translator.service"

@Component({
  selector: "page-guild-fleet-list",
  standalone: true,
  imports: [CommonModule, RouterModule, NavComponent, TranslateModule],
  templateUrl: "./guild-fleet-list.page.html",
  styleUrls: ["./guild-fleet-list.page.scss"],
})
export class GuildFleetListPage implements OnInit {
  spaceships: GuildSpaceship[] = []
  loading = true
  errorMessage = ""

  constructor(private spaceshipService: SpaceshipService,
    private translator: TranslatorService,
  ) { }

  ngOnInit(): void {
    this.loadSpaceships()
  }

  loadSpaceships(): void {
    this.loading = true
    this.spaceshipService.getGuildSpaceships().subscribe({
      next: (spaceships) => {
        this.spaceships = spaceships
        this.loading = false;
      },
      error: (errorCode) => {
        this.errorMessage = this.translator.translate(errorCode);
        this.loading = false
      },
    })
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
