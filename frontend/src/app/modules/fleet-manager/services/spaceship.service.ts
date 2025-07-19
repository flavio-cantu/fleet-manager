import { Injectable } from "@angular/core"
import { map, Observable } from "rxjs"
import { CcuSpaceship, GuildSpaceship, Spaceship } from "../../../models/spaceship.model"
import { ApiService } from "../../../services/api.base.service"

@Injectable()
export class SpaceshipService {

  private readonly endpoint: string = "fleet";
  private readonly ccuEndpoint: string = "hangar";

  constructor(private apiService: ApiService) {
  }

  getUserSpaceships(): Observable<Spaceship[]> {
    return this.apiService.get<Spaceship[]>(this.endpoint);
  }

  getUserCCUSpaceships(): Observable<CcuSpaceship[]> {
    return this.apiService.get<CcuSpaceship[]>(this.ccuEndpoint);
  }

  addSpaceship(spaceship: Spaceship): Observable<Spaceship> {
    return this.apiService.post<Spaceship>(this.endpoint, spaceship);
  }

  deleteSpaceship(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.endpoint}/${id}`);
  }

  loadShipNames(): Observable<string[]> {
    return this.apiService.getAsset<string[]>('assets/ships.json').pipe(
      map((ships: string[]) => ships.sort((a, b) => a.localeCompare(b)))
    );
  }

  downloadFleet(type: string) {
    return this.apiService.download(`${this.endpoint}/download/${type}`);
  }


  getGuildSpaceships(): Observable<GuildSpaceship[]> {
    return this.apiService.get<GuildSpaceship[]>(`guild/${this.endpoint}`);
  }

}
