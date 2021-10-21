import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityService {

  constructor(private http: HttpClient) { }

  Input(userId, name): Observable<any> {
    var json = { "UserId": userId, "Name": name };
    return this.http.post(`${environment.apiUrl}v1/responsibility/register`, json);
  }

  Change(userId, id, name): Observable<any> {
    var json = { "UserId": userId,"Id": id, "Name": name };
    return this.http.patch(`${environment.apiUrl}v1/responsibility/change`, json);
  }

  Remove(id, userId): Observable<any> {
    var json = { "Id": id , "UserId": userId};

    return this.http.request('DELETE',`${environment.apiUrl}v1/responsibility/remove`,{body: json});
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/responsibility/get`);
  }
}
