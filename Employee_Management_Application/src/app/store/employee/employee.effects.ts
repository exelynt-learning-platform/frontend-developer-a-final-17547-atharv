import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { EmployeeService } from '../../services/employee-service';
import { APP_MESSAGES } from '../../constants';
import { EmployeeActions } from './employee.actions';

/**
 * Side-effect handlers for the Employee feature. Every effect follows the
 * same shape: call the service, map the response to a *Success action, and
 * catchError into a *Failure action carrying a user-friendly message -
 * effects never let an HTTP error propagate unhandled.
 */
@Injectable()
export class EmployeeEffects {
  private readonly actions$ = inject(Actions);
  private readonly employeeService = inject(EmployeeService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      switchMap(() =>
        from(this.employeeService.getAllEmployee()).pipe(
          map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: error?.message ?? APP_MESSAGES.employee.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * Search employee by ID.
   */
  searchEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.searchEmployeeById),

      switchMap(({ id }) =>
        from(this.employeeService.getEmployeeById(id)).pipe(
          map((employee) =>
            EmployeeActions.searchEmployeeByIdSuccess({
              employee,
            }),
          ),

          catchError((error) =>
            of(
              EmployeeActions.searchEmployeeByIdFailure({
                error: error?.message ?? APP_MESSAGES.employee.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * Add a new employee.
   */
  addEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),

      switchMap(({ payload }) =>
        from(this.employeeService.createEmployee(payload)).pipe(
          map((employee) =>
            EmployeeActions.addEmployeeSuccess({
              employee,
            }),
          ),

          catchError((error) =>
            of(
              EmployeeActions.addEmployeeFailure({
                error: error?.message ?? APP_MESSAGES.employee.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * Update an existing employee.
   */
  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),

      switchMap(({ id, payload }) =>
        from(this.employeeService.updateEmployee(id, payload)).pipe(
          map((employee) =>
            EmployeeActions.updateEmployeeSuccess({
              employee,
            }),
          ),

          catchError((error) =>
            of(
              EmployeeActions.updateEmployeeFailure({
                error: error?.message ?? APP_MESSAGES.employee.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /**
   * Delete an employee.
   */
  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),

      switchMap(({ id }) =>
        from(this.employeeService.deleteEmployee(id)).pipe(
          map(() =>
            EmployeeActions.deleteEmployeeSuccess({
              id,
            }),
          ),

          catchError((error) =>
            of(
              EmployeeActions.deleteEmployeeFailure({
                error: error?.message ?? APP_MESSAGES.employee.loadFailed,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
