import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  Input(userId:number, description: string, departmentId: number): Observable<any> {
    var json = { "UserId": userId, "Description": description, "DepartmentId": departmentId };
    return this.http.post(`${environment.apiUrl}v1/questionsDepartment/register`, json);
  }

  Change(id: number,userId: number, description: string, departmentId: number): Observable<any> {
    var json = {"Id": id, "UserId": userId, "Description": description, "DepartmentId": departmentId};
    return this.http.patch(`${environment.apiUrl}v1/questionsDepartment/change`, json);
  }

  Remove(id: number,userId: number): Observable<any> {
    var json = { "Id": id, "UserId": userId };

    return this.http.request('DELETE', `${environment.apiUrl}v1/questionsDepartment/remove`, { body: json });
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/questionsDepartment/get`);
  }

  GetQuantity(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/questionsDepartment/get/quantity`);
  }

}
