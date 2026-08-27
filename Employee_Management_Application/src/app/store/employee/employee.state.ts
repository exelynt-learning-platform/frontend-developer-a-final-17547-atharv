import { EntityState } from '@ngrx/entity';
import { Employee } from '../..//interface/employee.interface';

/**
 * NgRx Entity state for employees, extended with the loading/error flags
 * needed by the list, search, create, update and delete flows. Keeping
 * every flow's loading/error pair separate lets the UI show, e.g., a
 * search spinner without also disabling the "Add Employee" button.
 */
export interface EmployeeState extends EntityState<Employee> {
  loading: boolean;
  error: string | null;

  searchLoading: boolean;
  searchError: string | null;
  /** Result of the last "search by id" call; null = no result / cleared. */
  searchResult: Employee | null;

  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  /** Id of the employee currently being deleted, if any. */
  deletingId: string | null;
  deleteError: string | null;
}
