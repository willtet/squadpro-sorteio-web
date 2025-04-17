import { SorteioApiService } from '../../services/sorteio-api.service';
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Site {
  id: number;
  descricao: string;
  link: string;
  mensagem: string;
  numeroSorteio: string; // valor retornado pela API (número sorteado)
  codigoInfluencer: string;
  sorteado: boolean;
}

@Component({
  selector: 'app-sorteio',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './sorteio.component.html',
  styleUrls: ['./sorteio.component.css']
})
export class SorteioComponent implements OnInit {
  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sorteioApiService: SorteioApiService
  ) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.lastInteractionTime.set(Date.now());
        this.isPaused = false;
      } else {
        this.isPaused = true;
      }
    });
  }

  disabled = signal(false);
  countdown = signal(0);
  lastInteractionTime = signal<number | null>(null);
  intervalId: any;
  isPaused = false;
  influencerType = signal(0);
  influencerCode = signal('');
  token = localStorage.getItem('authToken');
  showPopup: boolean = false;

  sites: Site[] = [];
  codigoInfluencer: string | null = null;
  menuOpen = false;

  ngOnInit() {
    this.loadSites();
  }

  loadSites() {
    this.sorteioApiService.consultarSorteio(this.token)
      .subscribe({
        next: (data) => {
          console.log('Sites carregados:', data);
          this.sites = data.filter(site => site.descricao !== 'INFLUENCER');
          const influencer = data.find(site => site.descricao === 'INFLUENCER');
          this.codigoInfluencer = influencer?.codigoInfluencer ? "Código: " + influencer?.codigoInfluencer + " | Número da sorte: "+ influencer?.numeroSorteio : null;
          this.influencerType.set(influencer?.id || 0);

          if (this.codigoInfluencer) {
            this.influencerCode.set(this.codigoInfluencer);

          }
        },
        error: (error) => {
          console.error('Erro ao carregar sites', error);
        }
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  sortearSite(site: Site) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.snackBar.open('Token inválido', 'Fechar', { duration: 3000 });
      return;
    }
    const body = {
      idTipo: site.id,
      token: token
    };
    this.disabled.set(true);
    window.open(site.link, '_blank');
    if (!site.sorteado) {
      this.startCountdown(4, body, site);
    } else {
      this.disabled.set(false);
    }
  }

  sortear(body: any, site: Site) {
    this.sorteioApiService.inserirSorteio(body, site)
      .subscribe({
        next: (result: string) => {
          site.numeroSorteio = result;
          site.sorteado = true;
          this.checkCompletion(); // Verifica se todas as ações foram concluídas
        },
        error: (error) => {
          this.snackBar.open('Erro ao sortear: ' + error, 'Fechar', { duration: 3000 });
          this.disabled.set(false);
        }
      });
  }


  startCountdown(seconds: number, body: any, site: Site) {
    this.countdown.set(seconds);
    this.lastInteractionTime.set(null);
    this.clearExistingInterval();

    this.intervalId = setInterval(() => {
      if (!this.isPaused && this.countdown() > 0) {
        this.countdown.set(this.countdown() - 1);
      }
      if (this.countdown() <= 0) {
        this.disabled.set(false);
        this.clearExistingInterval();
        this.sortear(body, site);
      }
    }, 1000);
  }

  clearExistingInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  submitInfluencerCode() {
    const token = localStorage.getItem('authToken');
    if (!token || !this.influencerCode() || this.influencerCode().length !== 6) {
      this.snackBar.open('Código do influenciador deve ter exatamente 6 dígitos e um token válido', 'Fechar', { duration: 3000 });
      return;
    }

    this.sorteioApiService.inserirSorteioInfluencer(this.influencerType(), token, this.influencerCode())
      .subscribe({
        next: (data: any) => {
          this.snackBar.open('Código enviado com sucesso!', 'Fechar', { duration: 3000 });
          this.codigoInfluencer = "Código: " + this.influencerCode() + " | Número da sorte: " + data;
          this.influencerCode.set(this.codigoInfluencer);
          this.checkCompletion(); // Verifica se todas as ações foram concluídas
        },
        error: (error) => {
          if(error.status === 400) {
            this.snackBar.open('Erro ao enviar código: ' + error.error, 'Fechar', { duration: 3000 });
          }
          else {
            this.snackBar.open('Ocorreu um erro ao enviar o código, tente novamente em alguns instantes.', 'Fechar', { duration: 3000 });
          }
        }
      });
  }


  checkCompletion() {
    // Verifica se todos os sites foram sorteados
    const allSitesSorted = this.sites.every(site => site.sorteado);
    // Verifica se o código do influenciador foi enviado
    const influencerCompleted = this.codigoInfluencer !== null;
    if (allSitesSorted && influencerCompleted) {
      this.showPopup = true;
    }
  }

  closePopup() {
    this.showPopup = false;
  }


  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
