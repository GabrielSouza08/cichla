import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  postLogin(username, password): Observable<any>{
    var credemtials = { "email": username, "password": password };
    return this.http.post(`${environment.apiUrl}usuarios/autenticar`, credemtials);
  }

}
