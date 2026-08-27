import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Country } from '../../interface/country.interface';
import { CountryActions } from './country.actions';
import { CountryState } from './country.state';

/** Entity adapter used to store countries by their API id. */
export const countryAdapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (country: Country): string => country.id,
});

/** Initial country state before the first API request. */
export const initialCountryState: CountryState = countryAdapter.getInitialState({
  loading: false,
  error: null,
  loaded: false,
});

/** Updates country state in response to country actions. */
export const countryReducer = createReducer(
  initialCountryState,

  on(CountryActions.loadCountries, (state) => ({ ...state, loading: true, error: null })),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) =>
    countryAdapter.setAll(countries, { ...state, loading: false, loaded: true }),
  ),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
