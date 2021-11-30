import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(private http: HttpClient) { }

  Input(name, idDepartment): Observable<any> {
    var json = { "description": name,  "idDepartment": idDepartment};
    return this.http.post(`${environment.apiUrl}area/cadastrar`, json);
  }

  Change(userId, id, name): Observable<any> {
    var json = { "UserId": userId, "Id": id, "Name": name };
    return this.http.patch(`${environment.apiUrl}v1/area/change`, json);
  }

  Remove(id): Observable<any> {
    return this.http.request('DELETE', `${environment.apiUrl}area/${id}`);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}area`);
  }

}
