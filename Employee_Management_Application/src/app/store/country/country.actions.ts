import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Country } from '../../interface/country.interface';

/** Actions used to load countries and report the request result. */
export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    /** Starts loading countries from the API. */
    'Load Countries': emptyProps(),
    /** Stores the countries returned by the API. */
    'Load Countries Success': props<{ countries: Country[] }>(),
    /** Stores a user-friendly country loading error. */
    'Load Countries Failure': props<{ error: string }>(),
  },
});
