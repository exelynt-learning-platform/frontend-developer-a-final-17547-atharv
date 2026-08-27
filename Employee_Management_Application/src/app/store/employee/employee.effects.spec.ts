import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Employee } from '../../interface/employee.interface';
import { EmployeeService } from '../../services/employee-service';
import { EmployeeActions } from './employee.actions';
import { EmployeeEffects } from './employee.effects';

describe('EmployeeEffects', () => {
  let actions$: Observable<any>;
  let effects: EmployeeEffects;
  let employeeService: {
    getAllEmployee: ReturnType<typeof vi.fn>;
    getEmployeeById: ReturnType<typeof vi.fn>;
    createEmployee: ReturnType<typeof vi.fn>;
    updateEmployee: ReturnType<typeof vi.fn>;
    deleteEmployee: ReturnType<typeof vi.fn>;
  };

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

  beforeEach(() => {
    const spy = {
      getAllEmployee: vi.fn(),
      getEmployeeById: vi.fn(),
      createEmployee: vi.fn(),
      updateEmployee: vi.fn(),
      deleteEmployee: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideMockActions(() => actions$),
        { provide: EmployeeService, useValue: spy },
      ],
    });

    effects = TestBed.inject(EmployeeEffects);
    employeeService = TestBed.inject(EmployeeService) as unknown as typeof spy;
  });

  it('should dispatch loadEmployeesSuccess when the API call succeeds', async () => {
    employeeService.getAllEmployee.mockReturnValue(of([employee]));
    actions$ = of(EmployeeActions.loadEmployees());

    await expect(firstValueFrom(effects.loadEmployees$)).resolves.toEqual(
      EmployeeActions.loadEmployeesSuccess({ employees: [employee] }),
    );
  });

  it('should dispatch loadEmployeesFailure when the server returns an error', async () => {
    employeeService.getAllEmployee.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' })),
    );
    actions$ = of(EmployeeActions.loadEmployees());

    const action = await firstValueFrom(effects.loadEmployees$);
    expect(action.type).toBe(EmployeeActions.loadEmployeesFailure.type);
    expect((action as any).error).toBe('Failed to load employees.');
  });

  it('should dispatch searchEmployeeByIdFailure on 404', async () => {
    employeeService.getEmployeeById.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })),
    );
    actions$ = of(EmployeeActions.searchEmployeeById({ id: '99' }));

    const action = await firstValueFrom(effects.searchEmployeeById$);
    expect(action.type).toBe(EmployeeActions.searchEmployeeByIdFailure.type);
    expect((action as any).error).toBe('Failed to load employees.');
  });

  it('should dispatch addEmployeeSuccess when creation succeeds', async () => {
    employeeService.createEmployee.mockReturnValue(of(employee));
    const { id, ...payload } = employee;
    actions$ = of(EmployeeActions.addEmployee({ payload }));

    await expect(firstValueFrom(effects.addEmployee$)).resolves.toEqual(
      EmployeeActions.addEmployeeSuccess({ employee }),
    );
  });

  it('should dispatch updateEmployeeSuccess when the update succeeds', async () => {
    const updated = { ...employee, name: 'Jane Updated' };
    employeeService.updateEmployee.mockReturnValue(of(updated));
    const payload = updated;
    actions$ = of(EmployeeActions.updateEmployee({ id: '1', payload }));

    await expect(firstValueFrom(effects.updateEmployee$)).resolves.toEqual(
      EmployeeActions.updateEmployeeSuccess({ employee: updated }),
    );
  });

  it('should dispatch deleteEmployeeSuccess when deletion succeeds', async () => {
    employeeService.deleteEmployee.mockReturnValue(of(undefined));
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));

    await expect(firstValueFrom(effects.deleteEmployee$)).resolves.toEqual(
      EmployeeActions.deleteEmployeeSuccess({ id: '1' }),
    );
  });

  it('should dispatch deleteEmployeeFailure when deletion fails', async () => {
    employeeService.deleteEmployee.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' })),
    );
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));

    const action = await firstValueFrom(effects.deleteEmployee$);
    expect(action.type).toBe(EmployeeActions.deleteEmployeeFailure.type);
  });
});
