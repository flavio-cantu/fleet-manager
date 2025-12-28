import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.base.service';
import { LoginResponse } from '../../../models/login.model';

@Injectable()
export class LoginService {
  private readonly endpoint: string = 'auth';

  constructor(private apiService: ApiService) {}

  login(form:any): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`${this.endpoint}/login`, form);
  }

}
