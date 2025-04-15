import { LoginApiService } from './../services/login-api.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './esqueci-senha.component.html',
  styleUrl: './esqueci-senha.component.css'
})
export class EsqueciSenhaComponent {
  forgotPasswordForm: FormGroup;
  message = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginApiService: LoginApiService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }

  onSubmit(): void {
    if (!this.email.valid) {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.loginApiService.esqueciSenha(this.email.value)
    .subscribe({
      next: (response: string) => {
        try {
          this.snackBar.open(response, 'Fechar', { duration: 5000 });
          this.router.navigate(['/login']);
        } catch (error) {
          this.snackBar.open('Erro inesperado na resposta do servidor.', 'Fechar', { duration: 5000 });
        } finally {
          this.isLoading = false;
        }
      },
      error: (error) => {
        const errorMessage = 'Ocorreu um erro, tente novamente em alguns instantes.';
        this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        this.isLoading = false;
      },
    });
  }
}
