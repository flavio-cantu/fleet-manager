import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { Spaceship } from "../models/spaceship.model"
import { ApiService } from "./api.base.service"

@Injectable({
  providedIn: "root",
})
export class SpaceshipService {

  private readonly endpoint: string = "fleet";

  constructor(private apiService: ApiService) {
  }

  getUserSpaceships(): Observable<Spaceship[]> {
    return this.apiService.get<Spaceship[]>(this.endpoint);
  }

  addSpaceship(spaceship: Spaceship): Observable<Spaceship> {
    return this.apiService.post<Spaceship>(this.endpoint, spaceship);
  }

  deleteSpaceship(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.endpoint}/${id}`);
  }
}
