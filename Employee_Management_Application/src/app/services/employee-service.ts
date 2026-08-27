import { inject, Service } from '@angular/core';
import { HttpService } from './http-service';
import { environment } from '../../environments/environment';
import { ENDPOINTS } from '../constants/endpoints';
import { APP_MESSAGES } from '../constants/messages';
import { request } from '../helpers/api-error';
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
    return request(
      this.http.get<Employee[]>(`${environment.apiBaseUrl}${ENDPOINTS.employee}`),
      APP_MESSAGES.employee.loadFailed,
    );
  }

  /**
   * Fetches an employee using its ID.
   *
   * @param id Employee identifier.
   * @returns Promise containing the requested employee.
   */
  async getEmployeeById(id: string): Promise<Employee> {
    return request(
      this.http.get<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`),
      APP_MESSAGES.employee.loadFailed,
    );
  }

  /**
   * Creates a new employee.
   *
   * @param employee Employee data to create.
   * @returns Promise containing the newly created employee.
   */
  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    return request(
      this.http.post<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}`, employee),
      APP_MESSAGES.employee.loadFailed,
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
    return request(
      this.http.put<Employee>(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`, employee),
      APP_MESSAGES.employee.loadFailed,
    );
  }

  /**
   * Deletes an employee using its ID.
   *
   * @param id Employee identifier.
   * @returns Promise that resolves when deletion succeeds.
   */
  async deleteEmployee(id: string): Promise<void> {
    await request(
      this.http.delete(`${environment.apiBaseUrl}${ENDPOINTS.employee}/${id}`),
      APP_MESSAGES.employee.loadFailed,
    );
  }
}
