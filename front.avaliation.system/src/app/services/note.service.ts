import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  Input(userId, description, descriptionEvaluation, value): Observable<any> {
    var json = { "UserId": userId, "Description": description, "DescriptionEvaluation": descriptionEvaluation, "Value": value };
    console.log('json',json)
    return this.http.post(`${environment.apiUrl}v1/note/register`, json);
  }

  Change(userId, id, description, descriptionEvaluation, value): Observable<any> {
    var json = { "UserId": userId, "Id": id, "Description": description, "DescriptionEvaluation": descriptionEvaluation, "Value": value };
    return this.http.patch(`${environment.apiUrl}v1/note/change`, json);
  }

  Remove(id, userId): Observable<any> {
    var json = { "Id": id, "UserId": userId };
    console.log('json',json)
    return this.http.request('DELETE', `${environment.apiUrl}v1/note/remove`, { body: json });
  }

  Get(type: string = ""): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/note/get/${type}`);
  }
}
