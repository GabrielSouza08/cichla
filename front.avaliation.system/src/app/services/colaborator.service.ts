import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaboratorService {

  constructor(private http: HttpClient) { }

  getColaborators(menagerId) {
    return this.http.get(`${environment.apiUrl}v1/colaborator/list/${menagerId}`);
  }

  getColaboratorDetais(colaboratorId) {
    return this.http.get(`${environment.apiUrl}v1/colaborator/details/${colaboratorId}`);
  }

  getBehavior(colaboratorId) {
    return this.http.get(`${environment.apiUrl}v1/colaborator/comportamento/${colaboratorId}`);
  }

  getTechnique(colaboratorId) {
    return this.http.get(`${environment.apiUrl}v1/colaborator/tecnica/${colaboratorId}`);
  }

  getChallenge(colaboratorName) {
    return this.http.get(`${environment.apiUrl}v1/colaborator/desafios/${colaboratorName}`);
  }


  Input(userId, name, email, userName, idEvaluator, profileId, localId, departamentId, areaId, responsibilityId): Observable<any> {
    var json = { "UserId": userId, "Name": name, "Email": email, "UserName": userName, "IdEvaluator": idEvaluator, "ProfileId": profileId, "LocalId": localId, "AreaId": areaId, "DepartamentId": departamentId, "ResponsibilityId": responsibilityId, };
    return this.http.post(`${environment.apiUrl}v1/collaborator/register`, json);
  }

  Change(userId, id, name, email, userName, idEvaluator, profileId, localId, departamentId, areaId, responsibilityId): Observable<any> {
    var json = { "UserId": userId, "Id": id, "Name": name, "Email": email, "UserName": userName, "IdEvaluator": idEvaluator, "ProfileId": profileId, "LocalId": localId, "AreaId": areaId, "DepartamentId": departamentId, "ResponsibilityId": responsibilityId, };
    return this.http.patch(`${environment.apiUrl}v1/collaborator/change`, json);
  }

  Remove(id, userId): Observable<any> {
    var json = { "Id": id, "UserId": userId };

    return this.http.request('DELETE', `${environment.apiUrl}v1/collaborator/remove`, { body: json });
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/collaborator/get`);
  }

  GetProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/collaborator/get-profile`);
  }

  GetEvaluator(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/collaborator/get-evaluator`);
  }

  GetEvaluatorDefined(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/collaborator/get-evaluator/defined`);
  }
}