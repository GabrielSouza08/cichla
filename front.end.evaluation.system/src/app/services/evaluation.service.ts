import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface FinalDataEvaluationElements {
  appraiseeId: string;
  questionId: string;
  noteId: string;
  evaluatorId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  constructor(private http: HttpClient) { }

  GetEvaluatonById(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}questoes-avalicao/${id}`);
  }

  GetScales(): Observable<any> {
    return this.http.get(`${environment.apiUrl}escalas`);
  }

  Evaluation(array: Array<FinalDataEvaluationElements>, type: string): Observable<any> {
    var json = { "listQuestionsEvaluation": array, "type": type };
    return this.http.post(`${environment.apiUrl}avaliacao`, json);
  }
}
