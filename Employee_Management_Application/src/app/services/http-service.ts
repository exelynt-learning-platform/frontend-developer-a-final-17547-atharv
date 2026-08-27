import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class HttpService {
  private http = inject(HttpClient);

  /**
   * Sends a POST request to the specified URL.
   *
   * @template T The expected response type.
   * @param url The API endpoint URL.
   * @param body The request payload.
   * @returns An observable containing the API response.
   */
  post<T>(url: string, body: object = {}): Observable<T> {
    return this.http.post<T>(url, body);
  }

  /**
   * Sends a GET request to the specified URL.
   *
   * @template T The expected response type.
   * @param url The API endpoint URL.
   * @param params Optional HTTP query parameters.
   * @returns An observable containing the API response.
   */
  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, {
      params,
    });
  }

  /**
   * Sends a DELETE request to the specified URL.
   *
   * @template T The expected response type.
   * @param url The API endpoint URL.
   * @param params Optional HTTP query parameters.
   * @returns An observable containing the API response.
   */
  delete<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.delete<T>(url, {
      params,
    });
  }

  /**
   * Sends a PUT request to the specified URL.
   *
   * @template T The expected response type.
   * @param url The API endpoint URL.
   * @param body The request payload.
   * @returns An observable containing the API response.
   */
  put<T>(url: string, body: object = {}): Observable<T> {
    return this.http.put<T>(url, body);
  }

  /**
   * Sends a PATCH request to the specified URL.
   *
   * @template T The expected response type.
   * @param url The API endpoint URL.
   * @param body The request payload.
   * @returns An observable containing the API response.
   */
  patch<T>(url: string, body: object = {}): Observable<T> {
    return this.http.patch<T>(url, body);
  }
}
