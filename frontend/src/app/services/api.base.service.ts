import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;
  toggleEDF: boolean = false;

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.baseUrl = environment.apiUrl;
  }

  toggleEdfOFF(toggleEDF: boolean) {
    this.toggleEDF = toggleEDF;
  }

  private handleError(error: any) {
    if (!error) {
      const msg = 'COMMON.TOAST.NO_COMS';
      this.toastService.pushFrontendError(msg);
      return throwError(() => msg);
    } else if (error == '404') {
      const msg = 'COMMON.TOAST.NOTFOUND';
      this.toastService.pushFrontendError(msg);
      return throwError(() => msg);
    } else if (error.errors[0] == '500') {
      const msg = 'COMMON.TOAST.BACKEND_ERROR';
      this.toastService.pushFrontendError(msg);
      return throwError(() => msg);
    }
    return throwError(() => error);
  }

  get<T>(endpoint: string, query?: any): Observable<T> {
    let params = new HttpParams();
    if (query) {
      params = this.createParams(params, query);
    }
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        params,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getAsset<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${endpoint}`);
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError.bind(this)));
  }

  download(endpoint: string, body: any = {}) {
    return this.http
      .post(`${this.baseUrl}/${endpoint}`, body, {
        responseType: 'blob',
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(this.handleError.bind(this)));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  createParams(params: HttpParams, query: any): HttpParams {
    Object.keys(query).forEach((key) => {
      if (query[key] !== '' && query[key] !== null && query[key] !== undefined) {
        if (typeof query[key] === 'object') {
          params = this.createParams(params, query[key]);
        } else {
          params = params.append(key, query[key].toString());
        }
      }
    });
    return params;
  }
}
