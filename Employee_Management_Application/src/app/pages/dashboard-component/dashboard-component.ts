import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Loader } from '../../shared/loader/loader';
import { Employee } from '../../interface/employee.interface';
import { EmployeeFormData, FormComponent } from '../form-component/form-component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation';
import { TableComponent } from '../table-component/table-component';
import { EmployeeActions } from '../../store/employee/employee.actions';
import {
  selectAllEmployees,
  selectDeletingId,
  selectFormSubmitting,
  selectEmployeesError,
  selectEmployeesLoading,
} from '../../store/employee/employee.selectors';
import { CountryActions } from '../../store/country/country.actions';
import {
  selectAllCountries,
  selectCountriesError,
  selectCountriesLoading,
} from '../../store/country/country.selectors';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormComponent,
    DeleteConfirmationComponent,
    TableComponent,
    Loader,
  ],
  selector: 'app-dashboard-component',
  styleUrl: './dashboard-component.scss',
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent implements OnInit {
  private readonly pageSize = 10;
  readonly EmployeeActions = EmployeeActions;
  readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  readonly employees = toSignal(this.store.select(selectAllEmployees), { initialValue: [] });
  readonly countries = toSignal(this.store.select(selectAllCountries), { initialValue: [] });
  readonly countriesLoading = toSignal(this.store.select(selectCountriesLoading), {
    initialValue: false,
  });
  readonly countriesError = toSignal(this.store.select(selectCountriesError), {
    initialValue: null,
  });
  readonly isLoading = toSignal(this.store.select(selectEmployeesLoading), { initialValue: false });
  readonly error = toSignal(this.store.select(selectEmployeesError), { initialValue: null });
  readonly deletingId = toSignal(this.store.select(selectDeletingId), { initialValue: null });
  readonly formSubmitting = toSignal(this.store.select(selectFormSubmitting), {
    initialValue: false,
  });
  showForm = false;
  editingId: string | null = null;
  selectedEmployee: Employee | null = null;
  showDeleteConfirmation = false;

  readonly searchForm = this.formBuilder.nonNullable.group({ id: [''] });
  searchTerm = '';
  currentPage = 1;

  /** Filters the complete employee list before selecting the current page. */
  get filteredEmployees(): Employee[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.employees();

    return this.employees().filter((employee) =>
      [employee.id, employee.name, employee.email, employee.emailId, employee.country]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }

  /** Returns the ten employee records for the current page. */
  get pagedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  /** Returns true while any dashboard request is running. */
  get isBusy(): boolean {
    return (
      this.isLoading() ||
      this.countriesLoading() ||
      this.formSubmitting() ||
      this.deletingId() !== null
    );
  }

  /** Load employees and countries when the page starts. */
  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
    this.store.dispatch(CountryActions.loadCountries());
  }

  /** Searches all loaded records by ID, name, email, or country. */
  onSearch(): void {
    this.searchTerm = this.searchForm.controls.id.value.trim().toLowerCase();
    this.currentPage = 1;
  }

  /** Clears the filter and returns to the first page of all records. */
  onClearSearch(): void {
    this.searchForm.reset();
    this.searchTerm = '';
    this.currentPage = 1;
  }

  /** Changes the page without allowing an invalid page number. */
  onPageChange(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  /** Open an empty form for a new employee. */
  onAddEmployee(): void {
    this.editingId = null;
    this.selectedEmployee = null;
    this.showForm = true;
  }

  /** Fill the form with the selected employee before updating it. */
  onEdit(employee: Employee): void {
    this.editingId = employee.id;
    const countryId =
      employee.countryId ??
      this.countries().find((country) => country.country === employee.country)?.id ??
      '';
    this.selectedEmployee = { ...employee, countryId };
    this.showForm = true;
  }

  /** Add API-only fields after the modal emits its simple form data. */
  onSubmit(formData: EmployeeFormData): void {
    // Only editable fields are copied into the API payload.
    const selectedCountry = this.countries().find((country) => country.id === formData.countryId);
    const payload = {
      ...formData,
      country: selectedCountry?.country ?? '',
      countryId: formData.countryId,
      avatar: '',
      emailId: formData.email,
    };
    if (this.editingId) {
      this.store.dispatch(
        EmployeeActions.updateEmployee({
          id: this.editingId,
          payload: { ...payload, id: this.editingId },
        }),
      );
    } else {
      this.store.dispatch(EmployeeActions.addEmployee({ payload }));
    }
    this.showForm = false;
    this.selectedEmployee = null;
  }

  /** Closes the employee form and clears the selected employee. */
  onCloseForm(): void {
    this.showForm = false;
    this.selectedEmployee = null;
  }

  /** Open the confirmation modal before dispatching a destructive action. */
  onDelete(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDeleteConfirmation = true;
  }

  /** Dispatches the delete action for the employee being confirmed. */
  onConfirmDelete(): void {
    if (this.selectedEmployee) {
      this.store.dispatch(EmployeeActions.deleteEmployee({ id: this.selectedEmployee.id }));
    }
    this.onCloseDelete();
  }

  /** Closes the delete dialog and clears its selected employee. */
  onCloseDelete(): void {
    this.showDeleteConfirmation = false;
    this.selectedEmployee = null;
  }
}
