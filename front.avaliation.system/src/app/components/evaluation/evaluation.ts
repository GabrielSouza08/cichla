import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { DepartmentService } from 'src/app/services/department.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";

export interface EvaluationElements {
  relationshipId: number;
  departmentId: number;
  departmentName: string;
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
  id: number;
  relationshipId: number;
  questionId: number;
  questionName: string;
  noteId: number;
  noteName: string;
  statusCode: boolean;
}

export interface FinalDataEvaluationElements {
  relationshipId: number;
  questionId: number;
  noteId: number;
}

export interface TransitionData {
  data: Array<FinalDataEvaluationElements>;
  status: boolean;
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

  public dataSourceDepartment = new MatTableDataSource<EvaluationElements>();

  public displayedColumnsDepartment: string[] = ["departmentName", "statusEvaluation"];

  public noteSet: Array<NoteElements> = [];
  public departmentSet: Array<EvaluationElements> = [];
  public evaluationDepartmentSet: Array<EvaluationElements> = [];
  public evaluationCompletedSet: Array<EvaluationCompletedElements> = [];

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formEvaluation: FormGroup;
  public formInput: FormGroup;
  public Evaluations: FormArray;

  public dataUser: any;
  public departmentName: string = "";

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public accessCloseChange: boolean;
  public idRemove: number;

  constructor(private formBuilder: FormBuilder, private collaboratorService: ColaboratorService, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.formDeclaration();
    this.getDataUser();
    this.ListsUpdate();
  }

  ListsUpdate() {

    let data: Array<EvaluationElements> = [
      {
        relationshipId:1, 
        departmentId:1, 
        departmentName:'Bruno Souza', 
        questionId:1, 
        questionName:'Entrega resultados?', 
        statusCode:1, 
        statusEvaluation:false
      },
      {
        relationshipId:2, 
        departmentId:2, 
        departmentName:'Marcos Almeida', 
        questionId:1, 
        questionName:'Qualidade de trabalho em equipe?', 
        statusCode:1, 
        statusEvaluation:false
      },
      {
        relationshipId:3, 
        departmentId:3, 
        departmentName:'Fernando Marques', 
        questionId:1, 
        questionName:'qualidade de comunicação?', 
        statusCode:1, 
        statusEvaluation:false
      }];

    this.getListNote();
    this.getEvaluationDepartment(data);
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  getListNote() {
    this.statusLoading = false;
    let data: Array<NoteElements> = [{
      id: 1,
      description: 'Distante do requerido',
      value: 1,
      type: '',
      registerDate: '',
      changeDate: '',
      statusCode: 1
    },
    {
      id: 2,
      description: 'Próximo do requerido',
      value: 1,
      type: '',
      registerDate: '',
      changeDate: '',
      statusCode: 1
    },
    {
      id: 3,
      description: 'Atende mas pode melhorar',
      value: 2,
      type: '',
      registerDate: '',
      changeDate: '',
      statusCode: 1
    },
    {
      id: 4,
      description: 'Atende completamente o requerido',
      value: 2,
      type: '',
      registerDate: '',
      changeDate: '',
      statusCode: 1
    },
    {
      id: 5,
      description: 'Supera o requerido',
      value: 2,
      type: '',
      registerDate: '',
      changeDate: '',
      statusCode: 1
    }
    ];

    this.noteSet = data;


//   } else {
//   this.openTable();
//   res.data.forEach(data => { this.showMessageError(data.message); });
// }
    //   this.noteService.Get("Departamento").subscribe(res => {
    // });
  }

getEvaluationDepartment(data: Array<EvaluationElements>) {
      this.departmentSet = [...data];
      this.dataSourceDepartment = new MatTableDataSource(this.departmentSet);
      this.evaluationDepartmentSet = data;

      sessionStorage.setItem('evaluationDepartmentSet', JSON.stringify(this.evaluationDepartmentSet));

      this.filterList();
      this.openTable();

  // this.departmentService.GetEvaluatonById(this.dataUser.id).subscribe(res => {
  //   if (res.success == true) {
  //     this.departmentSet = res.data;
  //     this.dataSourceDepartment = new MatTableDataSource(this.departmentSet);
  //     this.evaluationDepartmentSet = res.data;

  //     sessionStorage.setItem('evaluationDepartmentSet', JSON.stringify(this.evaluationDepartmentSet));

  //     if (res.data.length > 0) {
  //       this.filterList();
  //       this.openTable();
  //     } else { this.openNotFound(); }
  //   }
  // });
}

GetEvaluationCompleted(relarionshipId: number) {
  this.statusLoading = true;
  this.departmentService.GetEvaluatonCompletedByRelationship(relarionshipId).subscribe(res => {
    if (res.success == true) { this.evaluationCompletedSet = res.data; this.openView(); this.statusLoading = false; }
    else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }
  });
}

filterList() {
  let arrayDepartmentList: Array<EvaluationElements> = [];
  let departmentsId: Array<number> = [];

  this.dataSourceDepartment.data.forEach(element => {
    if (arrayDepartmentList.filter(option => option.departmentId == element.departmentId && option.statusEvaluation == element.statusEvaluation).length === 0) {
      arrayDepartmentList.push(element);
    }
    if (departmentsId.filter(option => option == element.departmentId).length === 0) {
      departmentsId.push(element.departmentId);
    }
  });

  departmentsId.forEach(id => {
    if (arrayDepartmentList.filter(option => option.departmentId == id).length > 1) {
      let data: EvaluationElements = arrayDepartmentList.filter(option => option.statusEvaluation == false && option.departmentId == id)[0];

      arrayDepartmentList = arrayDepartmentList.filter(option => option.departmentId != id);
      arrayDepartmentList.push(data);
    }
  });

  this.dataSourceDepartment = new MatTableDataSource(arrayDepartmentList);
}

// Obtem o elemento selecionado da lista de departamentos e verifica o status de avalição 
// Determinando se irá para divisão de avaliação 
// ou do relatório
ChangeOrInput(row ?: EvaluationElements) {
  console.log(row)
  this.evaluationDepartmentSet = JSON.parse(sessionStorage.getItem("evaluationDepartmentSet"));
  let data: Array<EvaluationElements> = this.evaluationDepartmentSet.filter(options => options.relationshipId == row.relationshipId);
  this.departmentName = row.departmentName;

  //Add na matriz de formpulario, para obter as questões dinamicamente 
  data.forEach(element => { this.addItem(element); });

  //Se o status de avaliacao for verdadeiro  
  //Então, obtem os dados avaliativos completos com base no id de relação e abre a view desses dados
  if (row.statusEvaluation) { this.GetEvaluationCompleted(row.relationshipId); }
  //Caso contrario, direciona para tela de avaliação
  else { this.openRegister(); }
}

createItem(row ?: EvaluationElements): FormGroup {
  return this.formBuilder.group({
    RelationshipId: [row.relationshipId, Validators.required]
    , DepartmentId: [row.departmentId, Validators.required]
    , DepartmentName: [row.departmentName]
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
  var status = true;
  this.Evaluations = this.formEvaluation.get('Evaluations') as FormArray;

  this.Evaluations.controls.forEach(form => {
    let data = form as FormGroup;
    if (!data.controls.NoteId.valid) { status = false; }
  });

  var array = this.Evaluations.value;
  var final: Array<FinalDataEvaluationElements> = [];

  if (array.length > 0) {
    console.log(array);
    var final: Array<FinalDataEvaluationElements> = [];

    array.forEach(element => {
      let row: FinalDataEvaluationElements;
      row = {
        relationshipId: element.RelationshipId,
        questionId: element.QuestionId,
        noteId: element.NoteId
      };
      if (row) { final.push(row); }
    });
  }

  let result: TransitionData = { data: final, status: status };
  return result;
}

//Todo
inputRegister() {

  var all: TransitionData = this.DataEvaluation();

  if (all.status) {
    this.statusLoading = true;

    let data: Array<EvaluationElements> = [
      {
        relationshipId:1, 
        departmentId:1, 
        departmentName:'Bruno Souza', 
        questionId:1, 
        questionName:'Entrega resultados?', 
        statusCode:1, 
        statusEvaluation:true
      },
      {
        relationshipId:2, 
        departmentId:2, 
        departmentName:'Marcos Almeida', 
        questionId:1, 
        questionName:'Qualidade de trabalho em equipe?', 
        statusCode:1, 
        statusEvaluation:false
      },
      {
        relationshipId:3, 
        departmentId:3, 
        departmentName:'Fernando Marques', 
        questionId:1, 
        questionName:'qualidade de comunicação?', 
        statusCode:1, 
        statusEvaluation:false
      }];

    this.showMessageSucceess(this.departmentName + ' avaliado(a) com sucesso!');
    setTimeout(() => { this.getEvaluationDepartment(data); }, 3000);

    // this.departmentService.Evaluation(all.data, "Register").subscribe(res => {

    //   if (res.success == true) {
    //     this.showMessageSucceess(this.departmentName + ' avaliado(a) com sucesso!');
    //     setTimeout(() => { this.getEvaluationDepartment(); }, 3000);
    //   }

    //   else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }

    // });
  }
  else { this.showMessageError('Preencha os campos obrigatórios!'); }
}

inputChange() {
  var all: TransitionData = this.DataEvaluation();
  let data: Array<EvaluationElements> = [
    {
      relationshipId:1, 
      departmentId:1, 
      departmentName:'Bruno Souza', 
      questionId:1, 
      questionName:'Entrega resultados?', 
      statusCode:1, 
      statusEvaluation:false
    },
    {
      relationshipId:2, 
      departmentId:2, 
      departmentName:'Marcos Almeida', 
      questionId:1, 
      questionName:'Qualidade de trabalho em equipe?', 
      statusCode:1, 
      statusEvaluation:false
    },
    {
      relationshipId:3, 
      departmentId:3, 
      departmentName:'Fernando Marques', 
      questionId:1, 
      questionName:'qualidade de comunicação?', 
      statusCode:1, 
      statusEvaluation:false
    }];

  if (all.status) {
    this.statusLoading = true;
    this.departmentService.Evaluation(all.data, "Change").subscribe(res => {

      if (res.success == true) {
        this.showMessageSucceess('A nova avaliação do(a)' + this.departmentName + ' foi concluída com sucesso!');
        setTimeout(() => { this.getEvaluationDepartment(data); }, 3000);
      }

      else { this.openTable(); res.data.forEach(data => { this.showMessageError(data.message); }); }

    });
  }
  else { this.showMessageError('Preencha os campos obrigatórios!'); }
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceDepartment.filter = filterValue.trim().toLowerCase();
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
  this.departmentName = "";
}
formDeclaration() {
  this.formEvaluation = this.formBuilder.group({
    Evaluations: this.formBuilder.array([])
  });
}
}
