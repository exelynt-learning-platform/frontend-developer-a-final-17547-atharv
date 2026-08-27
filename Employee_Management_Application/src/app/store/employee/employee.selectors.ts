import { createFeatureSelector, createSelector } from '@ngrx/store';
import { employeeAdapter } from './employee.reducer';
import { EmployeeState } from './employee.state';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

const { selectAll, selectTotal } = employeeAdapter.getSelectors(selectEmployeeState);

export const selectAllEmployees = selectAll;
export const selectEmployeeCount = selectTotal;

export const selectEmployeesLoading = createSelector(selectEmployeeState, (state) => state.loading);
export const selectEmployeesError = createSelector(selectEmployeeState, (state) => state.error);

export const selectSearchLoading = createSelector(selectEmployeeState, (state) => state.searchLoading);
export const selectSearchError = createSelector(selectEmployeeState, (state) => state.searchError);
export const selectSearchResult = createSelector(selectEmployeeState, (state) => state.searchResult);

export const selectCreateLoading = createSelector(selectEmployeeState, (state) => state.createLoading);
export const selectCreateError = createSelector(selectEmployeeState, (state) => state.createError);

export const selectUpdateLoading = createSelector(selectEmployeeState, (state) => state.updateLoading);
export const selectUpdateError = createSelector(selectEmployeeState, (state) => state.updateError);

export const selectDeletingId = createSelector(selectEmployeeState, (state) => state.deletingId);
export const selectDeleteError = createSelector(selectEmployeeState, (state) => state.deleteError);

/** True while any create/update request is in flight - used to disable the shared employee form's submit button. */
export const selectFormSubmitting = createSelector(
  selectCreateLoading,
  selectUpdateLoading,
  (creating, updating) => creating || updating
);
