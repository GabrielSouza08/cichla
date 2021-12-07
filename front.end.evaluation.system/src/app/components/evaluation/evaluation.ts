import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";

export interface EvaluationElements {
  appraiseeId: number;
  userId: number;
  userName: string;
  questionId: number;
  questionName: string;
  statusCode: number;
  statusEvaluation: boolean;
}
export interface NoteElements {
  id: number;
  description: string;
  value: number;
  type: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface EvaluationCompletedElements {
  id: string;
  appraiseeId: string;
  questionId: string;
  questionName: string;
  noteId: string;
  noteName: string;
  finalResult: number;
  statusCode: boolean;
}

export interface FinalDataEvaluationElements {
  appraiseeId: string;
  questionId: string;
  noteId: string;
  evaluatorId: string;
}

export interface TransitionData {
  data: Array<FinalDataEvaluationElements>;
  status: boolean;
  message: string;
}

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class FormtEvaluation implements OnInit {

  public filteredDepartment: Observable<Array<EvaluationElements>>;

  public departmentFilterCtrl: FormControl = new FormControl();

  public statusShowNotFound: boolean = false;
  public statusShowView: boolean = false;
  public statusShowTable: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowChange: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourceUser = new MatTableDataSource<EvaluationElements>();

  public displayedColumnsDepartment: string[] = ["userName", "statusEvaluation"];

  public noteSet: Array<NoteElements> = [];
  public userSet: Array<EvaluationElements> = [];
  public evaluationUserSet: Array<EvaluationElements> = [];
  public evaluationCompletedSet: Array<EvaluationCompletedElements> = [];

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formEvaluation: FormGroup;
  public formInput: FormGroup;
  public Evaluations: FormArray;

  public dataUser: any;
  public userName: string = "";

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public accessCloseChange: boolean;
  public idRemove: number;

  constructor(private formBuilder: FormBuilder, private departmentService: DepartmentService,  private evaluationService: EvaluationService) { }

  ngOnInit() {
    this.formDeclaration();
    this.getDataUser();
    this.ListsUpdate();
  }

  ListsUpdate() {
    this.getListNote();
    this.getEvaluationCollaborator();
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  getListNote() {
    this.statusLoading = true;

    this.evaluationService.GetScales().subscribe(res => {
      this.statusLoading = false;
      if (res.success == true) {
        this.noteSet = res.data;
      } else {
        this.openTable();
        res.data.forEach(data => { this.showMessageError(data.message); });
      }
    });
  }

getEvaluationCollaborator() {
  this.evaluationService.GetEvaluatonById(this.dataUser.id).subscribe(res => {
    if (res.success == true) {
      this.userSet = res.data;
      this.dataSourceUser = new MatTableDataSource(this.userSet);
      this.evaluationUserSet = res.data;

      sessionStorage.setItem('evaluationUserSet', JSON.stringify(this.evaluationUserSet));

      if (res.data.length > 0) {
        this.filterList();
        this.openTable();
      } else { this.openNotFound(); }
    }
  });
}

GetEvaluationCompleted(relarionshipId: number) {
  this.statusLoading = true;
  this.departmentService.GetEvaluatonCompletedByRelationship(relarionshipId).subscribe(res => {
    if (res.success == true) { this.evaluationCompletedSet = res.data;console.log(res.data); this.openView(); this.statusLoading = false; }
    else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }
  });
}

filterList() {
  let arrayDepartmentList: Array<EvaluationElements> = [];
  let departmentsId: Array<number> = [];

  this.dataSourceUser.data.forEach(element => {
    if (arrayDepartmentList.filter(option => option.userId == element.userId && option.statusEvaluation == element.statusEvaluation).length === 0) {
      arrayDepartmentList.push(element);
    }
    if (departmentsId.filter(option => option == element.userId).length === 0) {
      departmentsId.push(element.userId);
    }
  });

  departmentsId.forEach(id => {
    if (arrayDepartmentList.filter(option => option.userId == id).length > 1) {
      let data: EvaluationElements = arrayDepartmentList.filter(option => option.statusEvaluation == false && option.userId == id)[0];

      arrayDepartmentList = arrayDepartmentList.filter(option => option.userId != id);
      arrayDepartmentList.push(data);
    }
  });

  this.dataSourceUser = new MatTableDataSource(arrayDepartmentList);
}

// Obtem o elemento selecionado da lista de departamentos e verifica o status de avalição 
// Determinando se irá para divisão de avaliação 
// ou do relatório
ChangeOrInput(row ?: EvaluationElements) {
  this.evaluationUserSet = JSON.parse(sessionStorage.getItem("evaluationUserSet"));
  let data: Array<EvaluationElements> = this.evaluationUserSet.filter(options => options.appraiseeId == row.appraiseeId);
  this.userName = row.userName;

  //Add na matriz de formpulario, para obter as questões dinamicamente 
  data.forEach(element => { this.addItem(element); });

  //Se o status de avaliacao for verdadeiro  
  //Então, obtem os dados avaliativos completos com base no id de relação e abre a view desses dados
  if (row.statusEvaluation) { this.GetEvaluationCompleted(row.appraiseeId); }
  //Caso contrario, direciona para tela de avaliação
  else { this.openRegister(); }
}

createItem(row ?: EvaluationElements): FormGroup {
  return this.formBuilder.group({
    RelationshipId: [row.appraiseeId, Validators.required]
    , DepartmentId: [row.userId, Validators.required]
    , DepartmentName: [row.userName]
    , QuestionId: [row.questionId, Validators.required]
    , QuestionName: [row.questionName]
    , NoteId: [null, Validators.required]
  });
}

addItem(row ?: EvaluationElements): void {
  this.Evaluations = this.formEvaluation.get('Evaluations') as FormArray;
  this.Evaluations.push(this.createItem(row));
}

DataEvaluation(): TransitionData {
  var status: boolean = true;
  var count: number = 1;
  var message: string = '';
  this.Evaluations = this.formEvaluation.get('Evaluations') as FormArray; 

  this.Evaluations.controls.forEach(form => {
    let data = form as FormGroup;
    if (!data.controls.NoteId.valid) { 
      status = false; 
      message += `A ${count}º questão não foi preenchida. `
    }
    count++;
  });

  var array = this.Evaluations.value;
  var final: Array<FinalDataEvaluationElements> = [];

  if (array.length > 0) {
    var final: Array<FinalDataEvaluationElements> = [];

    array.forEach(element => {
      let row: FinalDataEvaluationElements;
      row = {
        appraiseeId: element.RelationshipId,
        questionId: element.QuestionId,
        noteId: element.NoteId,
        evaluatorId: this.dataUser.id
      };
      if (row) { final.push(row); }
    });
  }

  let result: TransitionData = { data: final, status: status, message: message};
  return result;
}

//Todo
inputRegister() {

  var all: TransitionData = this.DataEvaluation();

  if (all.status) {

    console.log('all', all)
    this.statusLoading = true;

    this.evaluationService.Evaluation(all.data, "Register").subscribe(res => {

      if (res.success == true) {
        this.showMessageSucceess(this.userName + ' avaliado(a) com sucesso!');
        setTimeout(() => { this.getEvaluationCollaborator(); }, 3000);
      }

      else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }

    });
  }
  else { 
    this.showMessageError('Preencha os campos obrigatórios!'); 
    this.showMessageError(all.message); 
  }
}

inputChange() {
  var all: TransitionData = this.DataEvaluation();
  if (all.status) {
    this.statusLoading = true;
    this.evaluationService.Evaluation(all.data, "Change").subscribe(res => {
      console.log('retorno', res.success)

      if (res.success == true) {
        this.showMessageSucceess('A nova avaliação do(a)' + this.userName + ' foi concluída com sucesso!');
        setTimeout(() => { this.getEvaluationCollaborator(); }, 3000);
      }

      else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }

    });
  }
  else { this.showMessageError('Preencha os campos obrigatórios!'); }
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceUser.filter = filterValue.trim().toLowerCase();
}

getValueAction(value: boolean) {
  this.accessAction = value;

  switch (true) {
    case this.accessCloseChange: {
      this.ActionCloseChange();
      break;
    }
  }
}

showMessageError(message: string) {
  this.statusLoading = false;
  this.statusMessage = true;
  this.messages.push(message);

  setTimeout(() => {
    this.statusMessage = false;
    this.messages = Array<string>();
  }, 10000);
}

showMessageSucceess(message: string) {
  this.statusLoading = false;
  this.messageSuccess = message;
  this.statusSuccess = true;

  setTimeout(() => {
    this.statusSuccess = false;
    this.messageSuccess = '';
  }, 4000);
}

showTable() {
  this.accessCloseChange = true;
  this.messageAction = 'Deseja sair da avalição?';
  if (this.statusShowInput == true || this.statusShowChange == true) { this.openConfirmAction(); }
  else { this.openTable(); }
}

ActionCloseChange() {
  if (this.accessAction) {
    this.showMessageSucceess('Ok!');
    this.closeConfirmAction();
    this.openTable();
  } else {
    this.showMessageSucceess('Ok!');
    this.closeConfirmAction();
  }
}

checkLoading() {
  this.statusLoading = !this.statusLoading;
}

openTable() {
  this.statusShowTable = true;
  this.closeRegister();
  this.closeChange();
  this.closeNotFound();
  this.closeView();
  this.formDeclaration();
  this.claerDataDepartment();
}
closeTable() { this.statusShowTable = false; }

openRegister() {
  this.statusShowInput = true;
  this.closeTable();
  this.closeChange();
  this.closeNotFound();
  this.closeView();
}
closeRegister() { this.statusShowInput = false; }

openChange() {
  this.statusShowChange = true;
  this.closeTable();
  this.closeRegister();
  this.closeNotFound();
  this.closeView();
}
closeChange() { this.statusShowChange = false; }

openNotFound() {
  this.statusShowNotFound = true;
  this.closeTable();
  this.closeChange();
  this.closeRegister();
  this.closeView();
}
closeNotFound() { this.statusShowNotFound = false; }

openView() {
  this.statusShowView = true;
  this.closeTable();
  this.closeChange();
  this.closeNotFound();
  this.closeRegister();
}
closeView() { this.statusShowView = false; }

openConfirmAction() { this.statusConfirmAction = true; }
closeConfirmAction() { this.statusConfirmAction = false; }

claerDataDepartment() {
  this.userName = "";
}
formDeclaration() {
  this.formEvaluation = this.formBuilder.group({
    Evaluations: this.formBuilder.array([])
  });
}
}
