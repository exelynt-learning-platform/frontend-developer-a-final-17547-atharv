import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';
import { Employee } from '../../interface/employee.interface';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.html',
  styleUrl: './delete-confirmation.scss',
})
export class DeleteConfirmationComponent implements AfterViewInit {
  @ViewChild('deleteModal') private deleteModalElement!: ElementRef<HTMLElement>;
  @Input() employee: Employee | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  private modalInstance!: Modal;

  /** Creates and opens the Bootstrap modal after its element is available. */
  ngAfterViewInit(): void {
    if (!this.deleteModalElement?.nativeElement?.isConnected) return;

    this.modalInstance = new Modal(this.deleteModalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false,
      focus: true,
    });
    this.modalInstance.show();
  }

  /** Hides the modal, then tells the parent to delete the employee. */
  onConfirm(): void {
    this.hideModal(() => this.confirm.emit());
  }

  /** Hides the modal, then tells the parent the action was cancelled. */
  onClose(): void {
    this.hideModal(() => this.close.emit());
  }

  /** Wait for Bootstrap to remove its backdrop before Angular removes this component. */
  private hideModal(afterHidden: () => void): void {
    this.deleteModalElement.nativeElement.addEventListener('hidden.bs.modal', afterHidden, {
      once: true,
    });
    this.modalInstance.hide();
  }
}
