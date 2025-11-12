import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CategoryService } from '../../../services/category';

@Component({
  selector: 'app-category-update',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './update.html',
  styleUrl: './update.css',
  providers: [MessageService]
})
export class Update implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  categoryId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = parseInt(id);
      this.loadCategory();
    }
  }

  loadCategory(): void {
    this.loading = true;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.form.patchValue(category);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Error al cargar la categoría'
        });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;
      const categoryData = this.form.value;

      this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada correctamente'
          });
          setTimeout(() => this.router.navigate(['/categories']), 1000);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Error al actualizar la categoría'
          });
          this.loading = false;
        }
      });
    } else {
      this.form.get('name')?.markAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/categories']);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `El nombre es requerido`;
      if (field.errors['minlength']) return `El nombre debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}