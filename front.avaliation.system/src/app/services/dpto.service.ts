import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DptoService {

  constructor(private http: HttpClient) { }

  getDptos(menagerId) {
    return this.http.get(`${environment.apiUrl}v1/dpto/list/${menagerId}`);
  }
}
