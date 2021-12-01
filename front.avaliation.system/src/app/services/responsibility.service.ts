import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EvaluationElements } from '../components/evaluation/evaluation';

export interface ElementsFinal {
  AreaId: string;
  ResponsibilityId: string;
  Status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityService {

  constructor(private http: HttpClient) { }

  Input(userId, name): Observable<any> {
    var json = { "description": name };
    return this.http.post(`${environment.apiUrl}cargo/cadastrar`, json);
  }
  
  InputAreaResponsibility(data: Array<ElementsFinal>): Observable<any> {
    var json = { "relation": data };
    return this.http.post(`${environment.apiUrl}cargo/cadastrar-cargo-area`, json);
  }

  Change(userId, id, name): Observable<any> {
    var json = { "UserId": userId,"Id": id, "Name": name };
    return this.http.patch(`${environment.apiUrl}v1/responsibility/change`, json);
  }

  Remove(id, userId): Observable<any> {
    return this.http.request('DELETE',`${environment.apiUrl}cargo/${id}`);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}cargo`);
  }

  GetRelationshipResponsibilityArea(): Observable<any> {
    return this.http.get(`${environment.apiUrl}cargo/relacao-area`);
  }
}
