import { Routes } from '@angular/router';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { authGuard } from './auth.guard';
import { loginGuard } from './login.guard';
import { ConfirmacaoRegistroComponent } from './pages/confirmacao-registro/confirmacao-registro.component';
import { LoginComponent } from './pages/login/login.component';
import { EsqueciSenhaComponent } from './pages/esqueci-senha/esqueci-senha.component';
import { SorteioComponent } from './pages/sorteio/sorteio.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent , canActivate: [loginGuard] },
  { path: 'signup', component: CriarContaComponent },
  { path: 'forgot-password', component: EsqueciSenhaComponent, canActivate: [loginGuard] },
  { path: 'sorteio', component: SorteioComponent, canActivate: [authGuard] },
  { path: 'confirm', component: ConfirmacaoRegistroComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
