import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import Modal from 'bootstrap/js/dist/modal';
import { APP_MESSAGES, VALIDATION_PATTERNS } from '../../constants';
import { Country } from '../../interface/country.interface';
import { Employee } from '../../interface/employee.interface';

export interface EmployeeFormData {
  name: string;
  email: string;
  mobile: string;
  countryId: string;
  state: string;
  district: string;
}

// Required allows spaces, so this validator checks the trimmed value as well.
function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { required: true };
}

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-form-component',
  styleUrl: './form-component.scss',
  templateUrl: './form-component.html',
})
export class FormComponent implements AfterViewInit, OnChanges {
  @ViewChild('employeeModal') private employeeModalElement!: ElementRef<HTMLElement>;
  @Input() employee: Employee | null = null;
  @Input() countries: Country[] = [];
  @Input() countriesLoading = false;
  @Input() countriesError: string | null = null;
  @Input() isSubmitting = false;
  @Output() save = new EventEmitter<EmployeeFormData>();
  @Output() close = new EventEmitter<void>();

  private readonly formBuilder = new FormBuilder();
  readonly employeeForm = this.formBuilder.nonNullable.group({
    name: ['', [requiredTrimmed, Validators.maxLength(50)]],
    email: [
      '',
      [requiredTrimmed, Validators.pattern(VALIDATION_PATTERNS.email), Validators.maxLength(100)],
    ],
    mobile: [
      '',
      [requiredTrimmed, Validators.pattern(VALIDATION_PATTERNS.mobile), Validators.maxLength(15)],
    ],
    countryId: ['', requiredTrimmed],
    state: ['', [requiredTrimmed, Validators.maxLength(50)]],
    district: ['', [requiredTrimmed, Validators.maxLength(50)]],
  });
  private modalInstance!: Modal;

  get isEditing(): boolean {
    return !!this.employee;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee']) {
      this.setFormValue();
    }
  }

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.employeeModalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false,
      focus: true,
    });
    this.modalInstance.show();
  }

  /** Fill the form whenever the selected employee changes. */
  private setFormValue(): void {
    if (!this.employee) {
      this.employeeForm.reset();
      return;
    }

    this.employeeForm.patchValue({
      name: this.employee.name,
      email: this.employee.email || this.employee.emailId,
      mobile: this.employee.mobile,
      countryId: this.employee.countryId || '',
      state: this.employee.state,
      district: this.employee.district,
    });
  }

  /** Validates, trims, and emits employee data after a valid submission. */
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    // Trim values before sending them to the dashboard and API.
    const values = this.employeeForm.getRawValue();
    const formData: EmployeeFormData = {
      name: values.name.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim(),
      countryId: values.countryId.trim(),
      state: values.state.trim(),
      district: values.district.trim(),
    };
    this.hideModal(() => this.save.emit(formData));
  }

  /** Removes non-numeric characters while the user types or pastes a mobile number. */
  onInput(field: string, event: Event): void {
    if (field !== 'mobile') return;

    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');
    input.value = digitsOnly;
    this.employeeForm.controls.mobile.setValue(digitsOnly);
  }

  /** Hides the Bootstrap modal before notifying the parent component. */
  onClose(): void {
    this.hideModal(() => this.close.emit());
  }

  /** Wait for Bootstrap to remove its backdrop before Angular removes this component. */
  private hideModal(afterHidden: () => void): void {
    this.employeeModalElement.nativeElement.addEventListener('hidden.bs.modal', afterHidden, {
      once: true,
    });
    this.modalInstance.hide();
  }

  /** Returns the validation message for a form field. */
  fieldError(field: string): string {
    const control = this.employeeForm.get(field);
    if (control?.hasError('required')) return APP_MESSAGES.validation.required;
    if (control?.hasError('pattern')) {
      return field === 'mobile' ? APP_MESSAGES.validation.mobile : APP_MESSAGES.validation.email;
    }
    if (control?.hasError('maxlength')) return APP_MESSAGES.validation.tooLong;
    return '';
  }
}
