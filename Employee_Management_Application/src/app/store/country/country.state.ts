import { EntityState } from '@ngrx/entity';
import { Country } from '../../interface/country.interface';

export interface CountryState extends EntityState<Country> {
  loading: boolean;
  error: string | null;
  /** True once a successful load has completed, so effects can skip refetching. */
  loaded: boolean;
}
