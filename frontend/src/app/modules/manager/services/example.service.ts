import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.base.service';
import {
  ClientDetailResponse,
  ListClientResponse,
  SaveClient,
  SearchClientRequest,
} from '../../../models/example.model';

@Injectable()
export class ExampleService {
  private readonly endpoint: string = 'example';

  constructor(private apiService: ApiService) {}

  countClients(query: SearchClientRequest): Observable<number> {
    return this.apiService.get<number>(`${this.endpoint}/count`, query);
  }

  getClients(query?: SearchClientRequest): Observable<ListClientResponse[]> {
    return this.apiService.get<ListClientResponse[]>(this.endpoint, query);
  }

  getClient(id: number): Observable<ClientDetailResponse> {
    return this.apiService.get<ClientDetailResponse>(`${this.endpoint}/${id}`);
  }

  addClient(client: SaveClient): Observable<SaveClient> {
    return this.apiService.post<SaveClient>(this.endpoint, client);
  }

  updateClient(id: number, client: SaveClient): Observable<SaveClient> {
    return this.apiService.put<SaveClient>(`${this.endpoint}/${id}`, client);
  }

  deleteClient(id: number): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.endpoint}/${id}`);
  }
}
