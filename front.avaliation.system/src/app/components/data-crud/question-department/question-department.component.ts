import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { DepartmentService } from 'src/app/services/department.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface OptionsElements {
  id: number;
  name: string;
  quantity: number;
}

export interface QuestionsQuantityElements {
  descriptionQuantity: number;
  departmentId: number;
  statusCode: number;
}

export interface DepartmentQuestionsElements {
  id: number;
  description: string;
  departmentId: number;
  departmentName: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface OptionsEvaluatorElements {
  id: number;
  name: string;
  responsibilityName: string;
  departmentId: number;
  departmentName: string;
  typeList: number;
}

@Component({
  selector: 'app-question-department',
  templateUrl: './question-department.component.html',
  styleUrls: ['./question-department.component.css']
})
export class QuestionDepartmentComponent implements OnInit {

  public filteredDepartment: Observable<Array<OptionsElements>>;

  public departmentFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowGroupContext: boolean = false;

  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourceDepartment = new MatTableDataSource<OptionsElements>();

  public displayedColumnsDepartment: string[] = ["name", "quantity"];

  public departmentSet: Array<OptionsElements> = [];
  public questionsQuantitySet: Array<QuestionsQuantityElements>;
  public questionDepartmentSet: Array<DepartmentQuestionsElements>;

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formInput: FormGroup;
  public formChange: FormGroup;

  public dataUser: any;
  public departmentName: string;
  public departmentId: number = undefined;

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public accessCloseChange: boolean;
  public idRemove: number;

  constructor(private formBuilder: FormBuilder, private questionService: QuestionService, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getDataUser();
    this.ListsUpdate();
    this.formDeclaration();
    this.startSearchOptions();
    this.openTable();
  }

  ListsUpdate() {
    this.getQuestionsQuantity();
    this.getQuestionsDepartment();
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  getListDepartment() {
    this.statusLoading = true;
    let list: Array<OptionsElements> = [];

    var questions: Array<QuestionsQuantityElements> = this.questionsQuantitySet;

    this.departmentService.Get().subscribe(res => {
      if (res.success == true) {
        this.questionsQuantitySet =
          res.data.forEach(function (element) {
            let row: OptionsElements;

            questions.forEach(quantity => {
              if (quantity.departmentId == element.id) { row = { id: element.id, name: element.name, quantity: quantity.descriptionQuantity }; }
            });

            if (!row) 
            {
              row = { id: element.id, name: element.name, quantity: 0 };
              list.push(row);
            }
            else 
            { list.push(row); }

          });
        this.departmentSet = list;
        this.dataSourceDepartment = new MatTableDataSource(this.departmentSet);
        this.statusLoading = false;
      } else {
        res.msg.forEach(message => { this.showMessageError(message.text); });
      }
    });
  }

  getQuestionsQuantity() {
    this.questionService.GetQuantity().subscribe(res => {
      if (res.success == true) {
        this.questionsQuantitySet = res.data;
        this.getListDepartment();
      } else {
        res.msg.forEach(message => { this.showMessageError(message.text); });
      }
    });
  }

  getQuestionsDepartment() {
    this.statusLoading = true;
    this.questionService.Get().subscribe(res => {
      if (res.success == true) {
        this.questionDepartmentSet = res.data;
        sessionStorage.setItem('questionDepartmentSet', JSON.stringify(this.questionDepartmentSet));
        this.statusLoading = false;
        if (this.departmentId != undefined) { this.filterListRelationships(this.departmentId) }
      } else {
        this.openTable();
        res.msg.forEach(message => { this.showMessageError(message.text); });
      }
    });
  }

  delete(row?: DepartmentQuestionsElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover está descrição?';
    this.openConfirmAction();
  }

  change(row?: DepartmentQuestionsElements) {
    this.accessActionRemove = true;
    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Description.setValue(row.description);
    this.openChange();
  }

  ActionRemove(value: number) {

    this.accessActionRemove = false;
    this.idRemove = 0;
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.questionService.Remove(value, this.dataUser.id).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Questão removida!');
          this.getQuestionsDepartment();
          this.openGroupContext();
        } else {
          this.openTable();
          res.msg.forEach(message => { this.showMessageError(message.text); });
        }
      });
    } else { this.showMessageSucceess('Ok!'); }
  }


  inputChange() {
    this.statusLoading = true;
    if (this.formChange.controls.Description.valid) {
      this.questionService.Change(
        this.formChange.controls.ID.value,
        this.dataUser.id,
        this.formChange.controls.Description.value,
        this.formChange.controls.DepartmentId.value).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Questão atualizada com sucesso!');
            this.getQuestionsDepartment();
            this.openGroupContext();

          } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Description.valid) {
      this.questionService.Input(
        this.dataUser.id,
        this.formInput.controls.Description.value,
        this.formInput.controls.DepartmentId.value).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Questão cadastrada com sucesso!');
            this.getQuestionsDepartment();
            this.openGroupContext();
          } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  getLine(row?: OptionsElements) {
    this.formInput.controls.DepartmentId.setValue(row.id);
    this.formChange.controls.DepartmentId.setValue(row.id);
    this.departmentName = row.name;
    this.departmentId = row.id;
    if (row.quantity > 0) { this.openGroupContext(); }
    else { this.openRegister(); }
  }

  startArrayOptions() {
    this.questionDepartmentSet = JSON.parse(sessionStorage.getItem("questionDepartmentSet"));
  }

  startSearchOptions() {
    this.formInput.get("DepartmentId").valueChanges.subscribe(value => {
      this.filterListRelationships(value);
    });
  }

  // Filtro das questões com base no departamento
  filterListRelationships(value: number = 0) {
    this.startArrayOptions();
    const filterValue = value.toString();

    if (this.questionDepartmentSet.filter(option => option.departmentId.toString().indexOf(filterValue) === 0).length > 0) {
      this.questionDepartmentSet = this.questionDepartmentSet.filter(option => option.departmentId.toString().indexOf(filterValue) === 0);
    } else {
      this.questionDepartmentSet = Array<DepartmentQuestionsElements>();
    }
  }

  filterDepartment(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.departmentSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDepartment.filter = filterValue.trim().toLowerCase();
  }

  getValueAction(value: boolean) {
    this.accessAction = value;

    switch (true) {
      case this.accessActionRemove: {
        this.ActionRemove(this.idRemove);
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
    }, 2000);
  }

  checkLoading() {
    this.statusLoading = !this.statusLoading;
  }

  openTable() {
    this.getQuestionsQuantity();
    this.statusShowTable = true;
    this.closeRegister();
    this.closeGroupContext();
    this.closeChange();
    this.clearDataDepartment();
    this.formDeclaration();
    this.startArrayOptions();
    this.startSearchOptions();
  }
  closeTable() { this.statusShowTable = false; }

  openRegister() {
    this.statusShowInput = true;
    this.closeTable();
    this.closeChange();
    this.closeGroupContext();
  }
  closeRegister() { this.statusShowInput = false; }

  openChange() {
    this.statusShowChange = true;
    this.closeTable();
    this.startSearchOptions();
    this.closeGroupContext();
    this.closeRegister();
  }
  closeChange() { this.statusShowChange = false; }

  openGroupContext() {
    this.statusShowGroupContext = true;
    this.closeRegister();
    this.closeChange();
    this.closeTable();
    this.clearDescripttionForminput();
  }
  closeGroupContext() { this.statusShowGroupContext = false; }

  openConfirmAction() { this.statusConfirmAction = true; }
  closeConfirmAction() { this.statusConfirmAction = false; }

  clearDataDepartment() {
    this.departmentName = "";
    this.departmentId = undefined;
  }

  clearDescripttionForminput() {
    this.formInput.controls.Description.setValue("");
  }

  formDeclaration() {
    this.formInput = this.formBuilder.group({
      DepartmentId: [null, Validators.required]
      , Description: [null, Validators.required]
    });

    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , DepartmentId: [null, Validators.required]
      , Description: [null, Validators.required]
    });
  }
}
