import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionService } from 'src/app/services/question.service';
import { CriterionService } from 'src/app/services/criterion.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SubscribeOnObservable } from 'rxjs/internal-compatibility';

export interface OptionsElements {
  id: string;
  name: string;
  quantity: number;
}

export interface QuestionsQuantityElements {
  descriptionQuantity: number;
  criterionId: string;
  statusCode: number;
}

export interface CriterionQuestionsElements {
  id: string;
  description: string;
  criterionId: string;
  criterionName: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionCriterionComponent implements OnInit {

  public filteredCriterion: Observable<Array<OptionsElements>>;

  public criterionFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowGroupContext: boolean = false;

  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourceCriterion = new MatTableDataSource<OptionsElements>();

  public displayedColumnsCriterion: string[] = ["name", "quantity"];

  public criterionSet: Array<OptionsElements> = [];
  public questionsQuantitySet: Array<QuestionsQuantityElements>;
  public questionCriterionSet: Array<CriterionQuestionsElements>;

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formInput: FormGroup;
  public formChange: FormGroup;

  public dataUser: any;
  public criterionName: string;
  public criterionId: string = undefined;

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public accessCloseChange: boolean;
  public idRemove: string;

  constructor(private formBuilder: FormBuilder, private questionService: QuestionService, private criterionService: CriterionService) { }

  ngOnInit() {
    this.getDataUser();
    this.ListsUpdate();
    this.formDeclaration();
    this.startSearchOptions();
    this.openTable();
  }

  ListsUpdate() {
    this.getQuestionsQuantity();
    this.getQuestionsCriterion();
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  getListCriterion() {
    this.statusLoading = true;
    let list: Array<OptionsElements> = [];

    var questions: Array<QuestionsQuantityElements> = this.questionsQuantitySet;
    
    this.criterionService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
            let row: OptionsElements;

            questions.forEach(quantity => {
              if (quantity.criterionId == element.id) { row = { id: element.id, name: element.name, quantity: quantity.descriptionQuantity }; }
            });

            if (!row) 
            {
              row = { id: element.id, name: element.name, quantity: 0 };
              list.push(row);
            }
            else 
            { list.push(row); }

          });
        this.criterionSet = list;
        this.dataSourceCriterion = new MatTableDataSource([...this.criterionSet]);
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
        this.getListCriterion();
      } else {
        res.msg.forEach(message => { this.showMessageError(message.text); });
      }
    });
  }

  getQuestionsCriterion() {
    this.statusLoading = true;
    this.questionService.Get().subscribe(res => {
      if (res.success == true) {
        this.questionCriterionSet = res.data;
        sessionStorage.setItem('questionCriterionSet', JSON.stringify(this.questionCriterionSet));
        this.statusLoading = false;
        if (this.criterionId != undefined) { this.filterListRelationships(this.criterionId) }
      } else {
        this.openTable();
        res.msg.forEach(message => { this.showMessageError(message.text); });
      }
    });
  }

  delete(row?: CriterionQuestionsElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover está descrição?';
    this.openConfirmAction();
  }

  change(row?: CriterionQuestionsElements) {
    this.accessActionRemove = true;
    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Description.setValue(row.description);
    this.openChange();
  }

  ActionRemove(value: string) {

    this.accessActionRemove = false;
    this.idRemove = '0';
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.questionService.Remove(value).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Questão removida!');

          setTimeout(() => { 
            this.getQuestionsCriterion();
          this.openGroupContext();
          }, 1500); 
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
        this.formChange.controls.Description.value,
        this.formChange.controls.CriterionId.value).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Questão atualizada com sucesso!');

            setTimeout(() => { 
              this.getQuestionsCriterion();
            this.openGroupContext();
            }, 1500);
        
          } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Description.valid) {
      this.questionService.Input(
        this.formInput.controls.Description.value,
        this.formInput.controls.CriterionId.value).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Questão cadastrada com sucesso!');
            setTimeout(() => { 
              this.getQuestionsCriterion();
            this.openGroupContext();
            }, 1500); 
          } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  getLine(row?: OptionsElements) {
    this.formInput.controls.CriterionId.setValue(row.id);
    this.formChange.controls.CriterionId.setValue(row.id);
    this.criterionName = row.name;
    this.criterionId = row.id;
    if (row.quantity > 0) { this.openGroupContext(); }
    else { this.openRegister(); }
  }

  startArrayOptions() {
    this.questionCriterionSet = JSON.parse(sessionStorage.getItem("questionCriterionSet"));
  }

  startSearchOptions() {
    this.formInput.get("CriterionId").valueChanges.subscribe(value => {
      this.filterListRelationships(value);
    });
  }

  // Filtro das questões com base no departamento
  filterListRelationships(value: string = '0') {
    this.startArrayOptions();
    const filterValue = value.toString();

    if (this.questionCriterionSet.filter(option => option.criterionId === value).length > 0) {
    
      this.questionCriterionSet = this.questionCriterionSet.filter(option => option.criterionId === value);

    } else {
      this.questionCriterionSet = Array<CriterionQuestionsElements>();
    }
  }

  filterCriterion(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.criterionSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCriterion.filter = filterValue.trim().toLowerCase();
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
    this.clearDataCriterion();
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

  clearDataCriterion() {
    this.criterionName = "";
    this.criterionId = undefined;
  }

  clearDescripttionForminput() {
    this.formInput.controls.Description.setValue("");
  }

  formDeclaration() {
    this.formInput = this.formBuilder.group({
      CriterionId: [null, Validators.required]
      , Description: [null, Validators.required]
    });

    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , CriterionId: [null, Validators.required]
      , Description: [null, Validators.required]
    });
  }
}
