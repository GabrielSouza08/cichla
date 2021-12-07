import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScalesService {

  constructor(private http: HttpClient) { }

  Change(id, description): Observable<any> {
    var json = { "id": id, "description": description };
    return this.http.put(`${environment.apiUrl}escalas`, json);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}escalas`);
  }
}
