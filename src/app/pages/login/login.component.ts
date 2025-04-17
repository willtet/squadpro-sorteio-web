import { LoginApiService } from '../../services/login-api.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    RouterModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar, private loginApiService: LoginApiService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', { duration: 3000 });
      return;
    }


    this.loginApiService.login(this.email, this.password)
    .subscribe({
      next: (response: string) => {
        try {
          const data = JSON.parse(response);
          localStorage.setItem('authToken', data.token);
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/sorteio']);
        } catch (error) {
          this.snackBar.open('Erro inesperado na resposta do servidor.', 'Fechar', { duration: 3000 });
        }
      },
      error: (error) => {
        const errorMessage = 'Ocorreu um erro ao realizar o login. Entre em contato com o suporte.';

        if (error.error && typeof error.error === 'object') {
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        } else if (error.error) {
          this.snackBar.open(error.error, 'Fechar', { duration: 3000 });
        } else {
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
        }
      },
    });
  }

}
