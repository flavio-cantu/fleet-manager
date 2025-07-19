import { Component, type OnInit } from "@angular/core"
import { GuildSpaceship } from "../../../../../models/spaceship.model"
import { SpaceshipService } from "../../../services/spaceship.service"
import { ManagerModule } from "../../../fleet-manager.module"
import { TableProperty } from "../../../../shared/components/table/app-client-table.component"

@Component({
  selector: "page-guild-fleet-list",
  standalone: true,
  imports: [ManagerModule],
  templateUrl: "./guild-fleet-list.page.html",
  styleUrls: ["./guild-fleet-list.page.scss"],
})
export class GuildFleetListPage implements OnInit {
  spaceships: GuildSpaceship[] = []
  loading = true
  errorMessage = ""


  columnsFleet: TableProperty[] = [{
    name: 'GUILD_SPACESHIP_LIST.OWNER',
    field: 'owner'
  }, {
    name: 'GUILD_SPACESHIP_LIST.NAME',
    field: 'name'
  }, {
    name: 'SPACESHIP_LIST.NICKNAME',
    field: 'nickname'
  }, {
    name: 'SPACESHIP_LIST.QUANTITY',
    field: 'quantity'
  }
  ];

  constructor(private spaceshipService: SpaceshipService
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
      error: (errors) => {
        this.errorMessage = errors;
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
