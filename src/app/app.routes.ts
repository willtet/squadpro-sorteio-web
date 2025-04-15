import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CriarContaComponent } from './pages/criar-conta/criar-conta.component';
import { authGuard } from './auth.guard';
import { SorteioComponent } from './sorteio/sorteio.component';
import { loginGuard } from './login.guard';
import { EsqueciSenhaComponent } from './esqueci-senha/esqueci-senha.component';
import { ConfirmacaoRegistroComponent } from './pages/confirmacao-registro/confirmacao-registro.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

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
