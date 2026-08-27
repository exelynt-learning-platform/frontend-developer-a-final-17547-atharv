import { Employee } from '../../interface/employee.interface';
import { EmployeeActions } from './employee.actions';
import { employeeReducer, initialEmployeeState } from './employee.reducer';

describe('employeeReducer', () => {
  const employee: Employee = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    emailId: 'jane@example.com',
    avatar: '',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune',
  };

  it('should return the initial state for an unknown action', () => {
    const state = employeeReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toBe(initialEmployeeState);
  });

  it('should set loading true on loadEmployees', () => {
    const state = employeeReducer(initialEmployeeState, EmployeeActions.loadEmployees());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should populate entities and clear loading on loadEmployeesSuccess', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, loading: true },
      EmployeeActions.loadEmployeesSuccess({ employees: [employee] }),
    );
    expect(state.loading).toBe(false);
    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(employee);
  });

  it('should set error and clear loading on loadEmployeesFailure', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, loading: true },
      EmployeeActions.loadEmployeesFailure({ error: 'boom' }),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('boom');
  });

  it('should add the created employee on addEmployeeSuccess', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, createLoading: true },
      EmployeeActions.addEmployeeSuccess({ employee }),
    );
    expect(state.createLoading).toBe(false);
    expect(state.entities['1']).toEqual(employee);
  });

  it('should upsert the employee on updateEmployeeSuccess', () => {
    const seeded = { ...initialEmployeeState, ids: ['1'], entities: { '1': employee } };
    const updated = { ...employee, name: 'Jane Updated' };
    const state = employeeReducer(
      seeded,
      EmployeeActions.updateEmployeeSuccess({ employee: updated }),
    );
    expect(state.entities['1']?.name).toBe('Jane Updated');
  });

  it('should remove the employee on deleteEmployeeSuccess', () => {
    const seeded = { ...initialEmployeeState, ids: ['1'], entities: { '1': employee } };
    const state = employeeReducer(seeded, EmployeeActions.deleteEmployeeSuccess({ id: '1' }));
    expect(state.ids).toEqual([]);
    expect(state.entities['1']).toBeUndefined();
  });

  it('should keep the employee in state and set deleteError on deleteEmployeeFailure', () => {
    const seeded = {
      ...initialEmployeeState,
      ids: ['1'],
      entities: { '1': employee },
      deletingId: '1',
    };
    const state = employeeReducer(seeded, EmployeeActions.deleteEmployeeFailure({ error: 'nope' }));
    expect(state.ids).toEqual(['1']);
    expect(state.deletingId).toBeNull();
    expect(state.deleteError).toBe('nope');
  });

  it('should store the search result on searchEmployeeByIdSuccess', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, searchLoading: true },
      EmployeeActions.searchEmployeeByIdSuccess({ employee }),
    );
    expect(state.searchLoading).toBe(false);
    expect(state.searchResult).toEqual(employee);
  });

  it('should clear the search result on clearSearch', () => {
    const state = employeeReducer(
      { ...initialEmployeeState, searchResult: employee, searchError: 'x' },
      EmployeeActions.clearSearch(),
    );
    expect(state.searchResult).toBeNull();
    expect(state.searchError).toBeNull();
  });
});
