import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  verificarToken(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/auth/verify/${token}`, { responseType: 'text' })
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/login`, {email:email, senha: password}, { responseType: 'text' })
  }

  registrar(userData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData, { responseType: 'text' })
  }

  confirmaRegistro(token: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/auth/confirm/${token}`, null, { responseType: 'text' })
  }

  esqueciSenha(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/password-reset`, {email: email}, { responseType: 'text' })
  }

  resetSenha(token: string, senha: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/auth/reset-password`, {toke: token, senha: senha}, { responseType: 'text' })
  }
}
