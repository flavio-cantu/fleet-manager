import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { ApiService } from "./api.base.service"
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {

  private readonly endpoint: string = "users";

  constructor(private apiService: ApiService) {
  }

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.endpoint}/${id}`);
  }

  allowUser(allow: boolean, id: string): Observable<boolean> {
    return this.apiService.put<boolean>(`${this.endpoint}/${id}/allow`, { allow: allow });
  }
}
