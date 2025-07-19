import { Component, type OnInit } from "@angular/core"
import { CcuSpaceship, Spaceship } from "../../../../../models/spaceship.model"
import { SpaceshipService } from "../../../services/spaceship.service"
import { TranslatorService } from "../../../../../services/translator.service"
import { ManagerModule } from "../../../fleet-manager.module"
import { ActionsProperty, TableProperty } from "../../../../shared/components/table/app-client-table.component"

@Component({
  selector: "page-fleet-list",
  standalone: true,
  imports: [ManagerModule],
  templateUrl: "./fleet-list.page.html",
  styleUrls: ["./fleet-list.page.scss"],
})
export class FleetListPage implements OnInit {
  spaceships: Spaceship[] = []
  ccuSpaceships: CcuSpaceship[] = []
  loading = true
  errorMessage = ""

  columnsFleet: TableProperty[] = [{
    name: 'SPACESHIP_LIST.NAME',
    field: 'name'
  }, {
    name: 'SPACESHIP_LIST.NICKNAME',
    field: 'nickname'
  }, {
    name: 'SPACESHIP_LIST.QUANTITY',
    field: 'quantity'
  }
  ];

  actionsFleet: ActionsProperty[] = [{
    callback: (row: Spaceship) => {
      this.deleteSpaceship(row.id)
    },
    icon: 'bi bi-trash3-fill',
    label: 'COMMON.DELETE'
  }
  ];

  columnCcu: TableProperty[] = [{
    name: 'SPACESHIP_LIST.NAME',
    field: 'name'
  }, {
    name: 'SPACESHIP_LIST.NICKNAME',
    field: 'nickname'
  }
  ];

  constructor(private spaceshipService: SpaceshipService,
    private translator: TranslatorService,
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
          error: (errors) => {
            this.errorMessage = errors;
            this.loading = false
          }
        });
      },
      error: (errors) => {
        this.errorMessage = errors;
        this.loading = false
      },
    })
  }

  deleteSpaceship(id: string | undefined): void {
    this.spaceshipService.deleteSpaceship(id!!).subscribe({
      next: () => {
        this.loadSpaceships()
      },
      error: (errors) => {
        this.errorMessage = errors;
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
