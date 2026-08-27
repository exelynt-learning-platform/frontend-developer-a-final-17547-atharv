import { inject, Service } from '@angular/core';
import { HttpService } from './http-service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Employee } from '../interface/employee.interface';

@Service()
export class EmployeeService {
  private http = inject(HttpService);

  /**
   * Fetches all employees from the API.
   *
   * @returns Promise containing the employee collection.
   */
  async getAllEmployee(): Promise<Employee[]> {
    return firstValueFrom(
      this.http.get<Employee[]>(`${environment.apiBaseUrl}${ENDPOINTS.employee}`),
    );
  }

  /**
   * Fetches an employee using its ID.
   *
   * @param id Employee identifier.
   * @returns Promise containing the requested employee.
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return firstValueFrom(
      this.http.get<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`),
    );
  }

  /**
   * Creates a new employee.
   *
   * @param employee Employee data to create.
   * @returns Promise containing the newly created employee.
   */
  async createEmployee(employee: Employee): Promise<Employee> {
    return firstValueFrom(
      this.http.post<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}`, employee),
    );
  }

  /**
   * Updates an existing employee.
   *
   * @param id Employee identifier.
   * @param employee Updated employee data.
   * @returns Promise containing the updated employee.
   */
  async updateEmployee(id: string, employee: Employee): Promise<Employee> {
    return firstValueFrom(
      this.http.put<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`, employee),
    );
  }

  /**
   * Deletes an employee using its ID.
   *
   * @param id Employee identifier.
   * @returns Promise that resolves when deletion succeeds.
   */
  async deleteEmployee(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`));
  }
}
