import { createFeatureSelector, createSelector } from '@ngrx/store';
import { countryAdapter } from './country.reducer';
import { CountryState } from './country.state';

/** Selects the complete country feature state. */
export const selectCountryState = createFeatureSelector<CountryState>('countries');

/** Returns all countries sorted by the entity adapter. */
export const selectAllCountries = countryAdapter.getSelectors(selectCountryState).selectAll;
/** Returns whether the country request is in progress. */
export const selectCountriesLoading = createSelector(selectCountryState, (state) => state.loading);
/** Returns the latest country request error. */
export const selectCountriesError = createSelector(selectCountryState, (state) => state.error);
/** Returns whether countries have loaded successfully. */
export const selectCountriesLoaded = createSelector(selectCountryState, (state) => state.loaded);
