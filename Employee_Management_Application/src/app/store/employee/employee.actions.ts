import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Employee } from '../../interface/employee.interface';

/**
 * All actions related to the Employee feature, grouped with createActionGroup
 * for concise, strongly-typed action creators (Employee.loadEmployees(), etc).
 */
export const EmployeeActions = createActionGroup({
  source: 'Employee',
  events: {
    /** Load all employees */
    'Load Employees': emptyProps(),
    'Load Employees Success': props<{ employees: Employee[] }>(),
    'Load Employees Failure': props<{ error: string }>(),

    /** Search a single employee by id */
    'Search Employee By Id': props<{ id: string }>(),
    'Search Employee By Id Success': props<{ employee: Employee }>(),
    'Search Employee By Id Failure': props<{ error: string }>(),
    'Clear Search': emptyProps(),

    /** Create */
    'Add Employee': props<{ payload: Employee }>(),
    'Add Employee Success': props<{ employee: Employee }>(),
    'Add Employee Failure': props<{ error: string }>(),

    /** Update */
    'Update Employee': props<{ id: string; payload: Employee }>(),
    'Update Employee Success': props<{ employee: Employee }>(),
    'Update Employee Failure': props<{ error: string }>(),

    /** Delete */
    'Delete Employee': props<{ id: string }>(),
    'Delete Employee Success': props<{ id: string }>(),
    'Delete Employee Failure': props<{ error: string }>(),
  },
});
