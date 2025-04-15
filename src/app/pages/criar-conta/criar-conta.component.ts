import { LoginApiService } from '../../services/login-api.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskDirective } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criar-conta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    NgxMaskDirective
  ],
  templateUrl: './criar-conta.component.html',
  styleUrls: ['./criar-conta.component.css']
})
export class CriarContaComponent {
  email: string = '';
  cpf: string = '';
  password: string = '';
  confirmPassword: string = '';
  nomeCompleto: string = '';
  dataNascimento: Date | null = null;
  tiktok: string | null = null;
  instagram: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  isLoading: boolean = false;

  aceitoNovidades: boolean = true;

  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private loginApiService: LoginApiService) {}

  validatePassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const validLength = password.length >= 8;
    return hasUpperCase && hasSpecialChar && validLength;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios corretamente.', 'Fechar', { duration: 3000 });
      return;
    }

    this.passwordError = '';
    this.confirmPasswordError = '';

    if (!this.validatePassword(this.password)) {
      this.passwordError = 'A senha deve ter pelo menos 8 caracteres, um caractere maiúsculo e um caractere especial.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'As senhas não correspondem!';
      return;
    }

    this.isLoading = true;

    const userData = {
      nome: this.nomeCompleto,
      cpf: this.cpf.replace(/\D/g, ''),
      email: this.email,
      senha: this.password,
      confirmacaoSenha: this.confirmPassword,
      dataNascimento: this.dataNascimento,
      instagram: this.instagram,
      aceitoNovidades: this.aceitoNovidades,
      ...(this.tiktok ? { tiktok: this.tiktok } : {})
    };

    this.loginApiService.registrar(userData)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Registro cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          const errorMessage = 'Ocorreu um erro ao cadastrar o registro. Por favor, tente novamente mais tarde.';
          if (error.error && typeof error.error === 'object') {
            this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
          } else if (error.error) {
            this.snackBar.open(error.error, 'Fechar', { duration: 3000 });
          } else {
            this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
          }

          this.isLoading = false;
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
