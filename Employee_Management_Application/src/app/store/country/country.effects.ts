import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { Country } from '../../services/country';
import { CountryActions } from './country.actions';
import { APP_MESSAGES } from '../../constants';

/** Handles API side effects for the country feature. */
@Injectable()
export class CountryEffects {
  private readonly actions$ = inject(Actions);
  private readonly countryService = inject(Country);

  /** Loads countries after the load action is dispatched. */
  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.loadCountries),

      switchMap(() =>
        from(this.countryService.getCountries()).pipe(
          map((countries) =>
            CountryActions.loadCountriesSuccess({
              countries,
            }),
          ),

          catchError((error) =>
            of(
              CountryActions.loadCountriesFailure({
                error: error instanceof Error ? error.message : APP_MESSAGES.country.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
