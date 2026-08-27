import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/services/employee.service';
import { EmployeeActions } from './employee.actions';
import { EmployeeEffects } from './employee.effects';

describe('EmployeeEffects', () => {
  let actions$: Observable<any>;
  let effects: EmployeeEffects;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const employee: Employee = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('EmployeeService', ['getAll', 'getById', 'create', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [EmployeeEffects, provideMockActions(() => actions$), { provide: EmployeeService, useValue: spy }]
    });

    effects = TestBed.inject(EmployeeEffects);
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  it('should dispatch loadEmployeesSuccess when the API call succeeds', (done) => {
    employeeService.getAll.and.returnValue(of([employee]));
    actions$ = of(EmployeeActions.loadEmployees());

    effects.loadEmployees$.subscribe((action) => {
      expect(action).toEqual(EmployeeActions.loadEmployeesSuccess({ employees: [employee] }));
      done();
    });
  });

  it('should dispatch loadEmployeesFailure with a friendly message on server error', (done) => {
    employeeService.getAll.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }))
    );
    actions$ = of(EmployeeActions.loadEmployees());

    effects.loadEmployees$.subscribe((action) => {
      expect(action.type).toBe(EmployeeActions.loadEmployeesFailure.type);
      expect((action as any).error).toContain('server encountered an error');
      done();
    });
  });

  it('should dispatch searchEmployeeByIdFailure with a not-found message on 404', (done) => {
    employeeService.getById.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }))
    );
    actions$ = of(EmployeeActions.searchEmployeeById({ id: '99' }));

    effects.searchEmployeeById$.subscribe((action) => {
      expect(action.type).toBe(EmployeeActions.searchEmployeeByIdFailure.type);
      expect((action as any).error).toContain('could not be found');
      done();
    });
  });

  it('should dispatch addEmployeeSuccess when creation succeeds', (done) => {
    employeeService.create.and.returnValue(of(employee));
    const { id, ...payload } = employee;
    actions$ = of(EmployeeActions.addEmployee({ payload }));

    effects.addEmployee$.subscribe((action) => {
      expect(action).toEqual(EmployeeActions.addEmployeeSuccess({ employee }));
      done();
    });
  });

  it('should dispatch updateEmployeeSuccess when the update succeeds', (done) => {
    const updated = { ...employee, name: 'Jane Updated' };
    employeeService.update.and.returnValue(of(updated));
    const { id, ...payload } = updated;
    actions$ = of(EmployeeActions.updateEmployee({ id: '1', payload }));

    effects.updateEmployee$.subscribe((action) => {
      expect(action).toEqual(EmployeeActions.updateEmployeeSuccess({ employee: updated }));
      done();
    });
  });

  it('should dispatch deleteEmployeeSuccess when deletion succeeds', (done) => {
    employeeService.delete.and.returnValue(of(employee));
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));

    effects.deleteEmployee$.subscribe((action) => {
      expect(action).toEqual(EmployeeActions.deleteEmployeeSuccess({ id: '1' }));
      done();
    });
  });

  it('should dispatch deleteEmployeeFailure when deletion fails', (done) => {
    employeeService.delete.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }))
    );
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));

    effects.deleteEmployee$.subscribe((action) => {
      expect(action.type).toBe(EmployeeActions.deleteEmployeeFailure.type);
      done();
    });
  });
});
