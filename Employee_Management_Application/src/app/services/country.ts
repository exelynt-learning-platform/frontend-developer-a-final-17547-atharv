import { inject, Service } from '@angular/core';
import { HttpService } from './http-service';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { environment } from '../../environments/environment';
import { Country as CountryModel } from '../interface/country.interface';
import { APP_MESSAGES } from '../constants';

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
    try {
      const response = await firstValueFrom(
        this.http.get<CountryModel[]>(`${environment.apiBaseUrl}${ENDPOINTS.country}`),
      );

      return response;
    } catch (error) {
      // Convert unknown HTTP errors into a message the UI can safely display.
      const message = error instanceof Error ? error.message : 'Country API request failed.';
      throw new Error(`${APP_MESSAGES.country.loadFailed}: ${message}`);
    }
  }
}
