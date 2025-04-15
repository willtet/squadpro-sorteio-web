import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Site {
  id: number;
  descricao: string;
  link: string;
  mensagem: string;
  numeroSorteio: string;
  codigoInfluencer: string;
  sorteado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SorteioApiService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  consultarSorteio(token: string | null): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/sorteio/consultar/${token}`);
  }

  inserirSorteio(body: any, site: Site): Observable<string> {
    return this.http.post(`${this.apiUrl}/sorteio/sortear`, body, { responseType: 'text' })
  }

  inserirSorteioInfluencer(influencerType: number, token: string,  influencerCode: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/sorteio/influencer`, { idTipo: influencerType, token, codInfluencer: influencerCode }, { responseType: 'text' })
  }

}
