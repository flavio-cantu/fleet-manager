import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { CcuSpaceship, Spaceship } from "../models/spaceship.model"
import { ApiService } from "./api.base.service"

@Injectable({
  providedIn: "root",
})
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
    return this.apiService.getAsset('assets/ships.json');
  }

  downloadFleet(type: string) {
    return this.apiService.download(`${this.endpoint}/download/${type}`);
  }
}
