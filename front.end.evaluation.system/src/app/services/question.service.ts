import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  Input(description: string, criterionId: string, ): Observable<any> {
    var json = { "description": description, "criterionId": criterionId };
    return this.http.post(`${environment.apiUrl}questao/cadastrar`, json);
  }

  Change(id: number, description: string, criterionId: string): Observable<any> {
    var json = { "id": id,"description": description, "criterionId": criterionId };
    return this.http.put(`${environment.apiUrl}questao/editar`, json);
  }

  Remove(id: string): Observable<any> {
    return this.http.request('DELETE', `${environment.apiUrl}questao/${id}`);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}questao`);
  }

  GetQuantity(): Observable<any> {
    return this.http.get(`${environment.apiUrl}questao/quantidade`);
  }

}
