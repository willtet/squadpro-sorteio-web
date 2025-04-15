import { LoginApiService } from '../../services/login-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmacao-registro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacao-registro.component.html',
  styleUrl: './confirmacao-registro.component.css'
})
export class ConfirmacaoRegistroComponent {
  message: string = 'Carregando...';
  token: string = '';

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private loginApiService: LoginApiService) {}

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (this.token) {
      this.confirmRegistration();
    } else {
      this.message = 'Token inválido ou ausente.';
    }
  }

  confirmRegistration(): void {
    this.loginApiService.confirmaRegistro(this.token)
    .subscribe({
      next: (response: any) => {
        this.message = response;
      },
      error: (error: HttpErrorResponse) => {
        this.message = 'Erro ao confirmar o cadastro. Por favor, tente novamente em alguns instantes.';
      }
    });
  }


  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
