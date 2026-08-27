import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Employee } from '../../interface/employee.interface';
import { EmployeeActions } from './employee.actions';
import { EmployeeState } from './employee.state';

export const employeeAdapter: EntityAdapter<Employee> = createEntityAdapter<Employee>({
  selectId: (employee: Employee): string => employee.id,
});

/** Initial employee state before any API request has completed. */
export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  error: null,
  searchLoading: false,
  searchError: null,
  searchResult: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deletingId: null,
  deleteError: null,
});

/** Updates employee state in response to employee actions. */
export const employeeReducer = createReducer(
  initialEmployeeState,

  on(EmployeeActions.loadEmployees, (state) => ({ ...state, loading: true, error: null })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, { ...state, loading: false, error: null }),
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(EmployeeActions.searchEmployeeById, (state) => ({
    ...state,
    searchLoading: true,
    searchError: null,
    searchResult: null,
  })),
  on(EmployeeActions.searchEmployeeByIdSuccess, (state, { employee }) => ({
    ...state,
    searchLoading: false,
    searchResult: employee,
  })),
  on(EmployeeActions.searchEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    searchLoading: false,
    searchError: error,
    searchResult: null,
  })),
  on(EmployeeActions.clearSearch, (state) => ({
    ...state,
    searchResult: null,
    searchError: null,
    searchLoading: false,
  })),

  on(EmployeeActions.addEmployee, (state) => ({
    ...state,
    createLoading: true,
    createError: null,
  })),
  on(EmployeeActions.addEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, { ...state, createLoading: false }),
  ),
  on(EmployeeActions.addEmployeeFailure, (state, { error }) => ({
    ...state,
    createLoading: false,
    createError: error,
  })),

  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    updateLoading: true,
    updateError: null,
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, { ...state, updateLoading: false }),
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    updateLoading: false,
    updateError: error,
  })),

  on(EmployeeActions.deleteEmployee, (state, { id }) => ({
    ...state,
    deletingId: id,
    deleteError: null,
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, { ...state, deletingId: null }),
  ),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    deletingId: null,
    deleteError: error,
  })),
);
