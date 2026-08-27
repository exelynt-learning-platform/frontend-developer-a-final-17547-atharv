import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EmployeeEffects } from './store/employee/employee.effects';
import { employeeReducer } from './store/employee/employee.reducer';
import { CountryEffects } from './store/country/country.effects';
import { countryReducer } from './store/country/country.reducer';

/** Application-wide providers for routing, HTTP, and NgRx state. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ employees: employeeReducer, countries: countryReducer }),
    provideEffects(EmployeeEffects, CountryEffects),
  ],
};
