import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CriterionService {

  constructor(private http: HttpClient) { }

  Input(name): Observable<any> {
    var json = { "description": name};
    return this.http.post(`${environment.apiUrl}criterio/cadastrar`, json);
  }

  InputAreaCriterion(data): Observable<any> {
    var json = { "relationship": data };
    return this.http.post(`${environment.apiUrl}criterio/relacao-area`, json);
  }

  Change(id, name): Observable<any> {
    var json = { "id": id, "description": name };
    return this.http.put(`${environment.apiUrl}criterio`, json);
  }

  Remove(id): Observable<any> {
    return this.http.request('DELETE', `${environment.apiUrl}criterio/${id}`);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}criterio`);
  }

  GetRelationshipCriterionArea(): Observable<any> {
    return this.http.get(`${environment.apiUrl}criterio/relacao-area`);
  }
}
