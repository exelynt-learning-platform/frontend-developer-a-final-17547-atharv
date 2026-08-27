import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../interface/employee.interface';

/** Dumb component that renders employee rows and emits user actions. */
@Component({
  imports: [CommonModule],
  selector: 'app-table-component',
  styleUrl: './table-component.scss',
  templateUrl: './table-component.html',
})
export class TableComponent {
  /** Employee rows supplied by the smart dashboard component. */
  @Input() employees: Employee[] = [];
  /** Total matching employees, independent of the current page size. */
  @Input() employeeCount = 0;
  /** Id of the employee currently being deleted. */
  @Input() deletingId: string | null = null;
  /** Current page details supplied by the smart component. */
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  /** Emits when the user requests an employee edit. */
  @Output() edit = new EventEmitter<Employee>();
  /** Emits when the user requests an employee deletion. */
  @Output() delete = new EventEmitter<Employee>();
  /** Emits when the user selects another page. */
  @Output() pageChange = new EventEmitter<number>();
}
