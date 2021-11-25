import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface OptionsInputElementsFinal {
  EvaluatorId: number;
  DepartmentId: number;
  Status: string;
}

export interface FinalDataEvaluationElements {
  relationshipId: number;
  questionId: number;
  noteId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


  constructor(private http: HttpClient) { }

  Input(userId, name): Observable<any> {
    var json = { "ds_departament": name };
    return this.http.post(`${environment.apiUrl}departamento/cadastrar`, json);
  }

  Change(userId, id, name): Observable<any> {
    var json = { "UserId": userId, "Id": id, "ds_departament": name };
    return this.http.patch(`${environment.apiUrl}v1/department/change`, json);
  }

  Remove(id, userId): Observable<any> {
    var paramters = `/${id}`;

    return this.http.request('DELETE', `${environment.apiUrl}departamento${paramters}`);
  }

  Get(): Observable<any> {
    return this.http.get(`${environment.apiUrl}departamento`);
  }

  InputRelationshipEvaluator(array: Array<OptionsInputElementsFinal>): Observable<any> {
    var json = { "ListRelationship": array };
    return this.http.post(`${environment.apiUrl}v1/relationshipDepartment/input`, json);
  }

  GetRelationshipEvaluator(): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/relationshipDepartment/get`);
  }

  GetRelationshipEvaluatorById(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/relationshipDepartment/get/${id}`);
  }

  GetEvaluatonById(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/departmentEvaluation/getById/${id}`);
  }

  GetEvaluatonCompletedByRelationship(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}v1/departmentEvaluation/getByRelationship/${id}`);
  }

  Evaluation(array: Array<FinalDataEvaluationElements>, type: string): Observable<any> {
    var json = { "ListQuestionsEvaluation": array, "Type": type };
    return this.http.post(`${environment.apiUrl}v1/departmentEvaluation/input`, json);
  }
}
