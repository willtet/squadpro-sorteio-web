import { LoginApiService } from './../services/login-api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const password: string = control.value;
  if (!password) return null;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const validLength = password.length >= 8;

  if (!hasUpperCase || !hasSpecialChar || !validLength) {
    return { passwordStrength: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
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
    ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading: boolean = false;
  hidePassword: boolean = true;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private loginApiService: LoginApiService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.snackBar.open('Preencha corretamente todos os campos.', 'Fechar', { duration: 3000 });
      return;
    }

    if (!this.token) {
      this.snackBar.open('Token inválido ou ausente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetPasswordForm.get('password')?.value;

    this.loginApiService.resetSenha(this.token, newPassword)
    .subscribe({
      next: (response: string) => {
        this.snackBar.open(response, 'Fechar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        const errorMessage = 'Ocorreu um erro ao redefinir a senha, tente novamente mais tarde.';
        this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
