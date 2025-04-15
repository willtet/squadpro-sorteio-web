import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, switchMap, of } from 'rxjs';
import { LoginApiService } from './services/login-api.service';

export const authGuard = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('authToken');
  const loginApiService = inject(LoginApiService);

  if (!token) {
    console.warn('AuthGuard: Nenhum token encontrado, redirecionando para login.');
    router.navigate(['/login']);
    return of(false);
  }

  return loginApiService.verificarToken(token)
  .pipe(
    tap(response => console.log('AuthGuard: Resposta da API', response)),
    map(() => true),
    catchError(error => {
      console.error('AuthGuard: Token inválido, removendo do localStorage e redirecionando.', error);
      localStorage.removeItem('authToken');
      if (router.url !== '/login') router.navigate(['/login']);
      return of(false);
    })
  );
};

