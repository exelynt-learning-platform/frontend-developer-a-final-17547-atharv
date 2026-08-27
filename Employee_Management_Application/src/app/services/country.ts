import { inject, Service } from '@angular/core';
import { HttpService } from './http-service';
import { ENDPOINTS } from '../constants/endpoints';
import { environment } from '../../environments/environment';
import { Country as CountryModel } from '../interface/country.interface';
import { APP_MESSAGES } from '../constants';
import { request } from '../helpers/api-error';

@Service()
export class Country {
  private http = inject(HttpService);

  /**
   * Fetches the list of countries from the API.
   *
   * @returns A promise containing the list of countries.
   * @throws The API error when the request fails.
   */
  async getCountries(): Promise<CountryModel[]> {
    return request(
      this.http.get<CountryModel[]>(`${environment.apiBaseUrl}${ENDPOINTS.country}`),
      APP_MESSAGES.country.loadFailed,
    );
  }
}
