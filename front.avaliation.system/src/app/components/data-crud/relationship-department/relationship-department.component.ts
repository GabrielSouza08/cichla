import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { AreaService } from 'src/app/services/area.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface DepartmentRelationshipsElements {
  id: number;
  evaluatorId: number;
  evaluatorName: string;
  departmentName: string;
  departmentId: number;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface OptionsElements {
  id: number;
  name: string;
  departmentId: number;
  typeList: number;
}

export interface OptionsEvaluatorElements {
  id: number;
  name: string;
  responsibilityName: string;
  departmentId: number;
  departmentName: string;
  typeList: number;
}

export interface OptionsInputElementsFinal {
  EvaluatorId: number;
  DepartmentId: number;
  Status: string;
}

@Component({
  selector: 'app-relationship-department',
  templateUrl: './relationship-department.component.html',
  styleUrls: ['./relationship-department.component.css']
})
export class RelationshipDepartmentComponent implements OnInit {

  public filteredEvaluator: Observable<Array<OptionsEvaluatorElements>>;
  public filteredDepartment: Observable<Array<OptionsElements>>;

  public evaluatorFilterCtrl: FormControl = new FormControl();
  public departmentFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowInput: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourceDepartment = new MatTableDataSource<OptionsElements>();
  public dataSourceEvaluatorRelationship = new MatTableDataSource<OptionsElements>();
  public dataSourceEvaluatorDefined = new MatTableDataSource<OptionsEvaluatorElements>();

  public displayedColumnsDepartment: string[] = ["name"];
  public displayedColumnsEvaluatorRelationship: string[] = ["name", "remove"];
  public displayedColumnsEvaluatorDefined: string[] = ["name", "departmentName", "input"]; //Add departamento

  public rowsDepartment: Array<DepartmentRelationshipsElements> = [{ id: 0, evaluatorId: 0, evaluatorName: 'Não encontrado', departmentName: 'Não encontrado', departmentId: 0, registerDate: '01/01/0001', changeDate: '01/01/0001', statusCode: 0 }];
  public rowsEvaluatorRelationship: Array<OptionsElements> = [];
  public rowsEvaluatorDefined: Array<OptionsEvaluatorElements> = [];

  public evaluatorSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: 0, responsibilityName: 'Indeterminado', departmentId: 0, departmentName: '',typeList: 2 }];
  public evaluatorBackupSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: 0, responsibilityName: 'Indeterminado', departmentId: 0, departmentName: '', typeList: 2 }];
  public departmentSet: Array<OptionsElements> = [];
  public departmentRelationshipSet: Array<OptionsElements> = [];
  public departmentRelationshipBackupSet: Array<OptionsElements> = [];
  public relationshipCompletion: Array<OptionsInputElementsFinal> = [];

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formInput: FormGroup;

  public dataUser: any;

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public accessCloseChange: boolean;
  public idRemove: number;

  constructor(private formBuilder: FormBuilder, private collaboratorService: ColaboratorService, private areaService: AreaService, private departmentService: DepartmentService, private responsibilityService: ResponsibilityService) { }

  ngOnInit() {
    this.ListsUpdate();
    this.openTable();
    this.formDeclaration();
    this.getDataUser();
    this.startSearchOptions();
  }

  ListsUpdate() {
    this.getListDepartmentRelationship();
    this.getListEvaluator();
    this.getListDepartment();
  }

  getListDepartment() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];

    this.departmentService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            name: element.name,
            departmentId: element.id,
            typeList: 0
          };
          if (row) { list.push(row); }
        });
        this.departmentSet = list;
        this.dataSourceDepartment = new MatTableDataSource(this.departmentSet);
      }
    });
  }

  getListDepartmentRelationship() {
    this.statusLoading = true;
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];

    this.departmentService.GetRelationshipEvaluator().subscribe(res => {
      if (res.success == true) {
        this.statusLoading = false;

        if (res.data.length > 0) this.rowsDepartment = res.data;

        res.data.forEach(function (element) {
          row = {
            name: element.evaluatorName,
            id: element.evaluatorId,
            departmentId: element.departmentId,
            typeList: 3
          };
          if (row) { list.push(row); }
        });
        this.departmentRelationshipSet = list;
        this.departmentRelationshipBackupSet = list;
        this.dataSourceEvaluatorRelationship = new MatTableDataSource(list);
        sessionStorage.setItem('relationshipSet', JSON.stringify(list));
        sessionStorage.setItem('relationshipSetChange', JSON.stringify(list));
      } else {
        this.openTable();
        res.data.forEach(data => { this.showMessageError(data.message); });
      }
    });
  }

  inputRegister() {
    this.statusLoading = true;
    this.relationshipCompletion = Array<OptionsInputElementsFinal>();
    
    let previousRelationship: Array<OptionsElements> = JSON.parse(sessionStorage.getItem("relationshipSet"));
    let departmentId: number = this.formInput.controls.DepartmentId.value;
    previousRelationship = previousRelationship.filter(options => options.departmentId == departmentId);

    let register: Array<OptionsElements> = this.dataSourceEvaluatorRelationship.data.filter(options => options.typeList == 2); // 2: Lista usuarios ainda não relacionados
    let remaining: Array<OptionsElements> = this.dataSourceEvaluatorRelationship.data.filter(options => options.typeList == 3);// 3: Lista usuarios já estavam relacionados
    let remove: Array<OptionsElements> = [];

    if (previousRelationship.length > 0) {
      if (remaining.length > 0) {
        remaining.forEach(element => {
          previousRelationship = previousRelationship.filter(options => options.id !== element.id);
        });
      }
      remove = previousRelationship;
    }

    if (remove.length > 0) {
      remove.forEach(element => {
        this.relationshipCompletion.push({ EvaluatorId: element.id, DepartmentId: element.departmentId, Status: 'Remove' });
      });
    }

    if (register.length > 0) {
      register.forEach(element => {
        this.relationshipCompletion.push({ EvaluatorId: element.id, DepartmentId: element.departmentId, Status: 'Include' });
      });
    }

    if (remove.length == 0 && register.length == 0) { this.showMessageError('Para salvar altere algum dado!'); }
    else {

      this.departmentService.InputRelationshipEvaluator(this.relationshipCompletion).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Alteração concluída!');
          setTimeout(() => { this.openTable(); }, 2000);
          
        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    }
  }

  getListEvaluator() {
    var row: OptionsEvaluatorElements;
    var list: Array<OptionsEvaluatorElements> = [];

    this.collaboratorService.GetEvaluatorDefined().subscribe(res => {
      if (res.success == true) {

        res.data.forEach(element => {
          row = {
            id: element.id,
            name: element.name,
            responsibilityName: element.responsibilityName,
            departmentId: element.departmentId,
            departmentName: element.departmentName,
            typeList: 2
          };
          if (row != undefined) { list.push(row); }
        });
        this.dataSourceEvaluatorDefined = new MatTableDataSource(list);
        sessionStorage.setItem('evaluatorSet', JSON.stringify(list));
      }
    });
  }
  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  getLine(row?: OptionsElements) {
    this.formInput.controls.DepartmentId.setValue(row.id);
    this.formInput.controls.DepartmentName.setValue(row.name);
    this.openRegister();
  }

  remove(row?: OptionsElements) {
    this.filterRemoveRelationships(row);
  }

  add(row?: OptionsEvaluatorElements) {
    this.filterAddRelationships(row);
  }

  startArrayOptions() {
    let evaluatorSet = JSON.parse(sessionStorage.getItem("evaluatorSet"));
    let relationshipSet = JSON.parse(sessionStorage.getItem("relationshipSet"));
    this.dataSourceEvaluatorDefined = new MatTableDataSource(evaluatorSet);
    this.dataSourceEvaluatorRelationship = new MatTableDataSource(relationshipSet);
    sessionStorage.setItem('relationshipSetChange', JSON.stringify(relationshipSet));
  }


  startSearchOptions() {
    this.formInput.get("DepartmentId").valueChanges.subscribe(value => {
      this.filterListRelationships(value);
    });

    this.formInput.get("DepartmentName").valueChanges.subscribe(value => {
      this.departmentFilterCtrl.setValue(value)
    });

    this.departmentFilterCtrl.valueChanges.subscribe(value => {
      this.filteredDepartment = this.departmentFilterCtrl.valueChanges.pipe(
        startWith(value),
        map(value => this.filterDepartment(value))
      );
    });
  }

  // Filtro de avaliadores com base no departamento
  // OBS: o padrão são os departamentos da diretoria e superintendência. 
  filterListRelationships(value: number = 0) {
    this.startArrayOptions();

    const filterValue = value.toString();

    if (this.dataSourceEvaluatorRelationship.data.filter(option => option.departmentId.toString().indexOf(filterValue) === 0).length > 0) {
      this.dataSourceEvaluatorRelationship = new MatTableDataSource(this.dataSourceEvaluatorRelationship.data.filter(option => option.departmentId.toString().indexOf(filterValue) === 0));

    } else {
      this.dataSourceEvaluatorRelationship = new MatTableDataSource<OptionsElements>();
    }

    if (this.dataSourceEvaluatorDefined.data.filter(option => option.departmentId.toString().indexOf(filterValue) === 0).length > 0) {
      this.dataSourceEvaluatorDefined = new MatTableDataSource(this.dataSourceEvaluatorDefined.data.filter(option => option.departmentId != Number(filterValue)));
    }

    if (this.dataSourceEvaluatorRelationship.data.length > 0) {
      this.dataSourceEvaluatorRelationship.data.forEach(element => {
        this.dataSourceEvaluatorDefined = new MatTableDataSource(this.dataSourceEvaluatorDefined.data.filter(option => option.id != element.id));
      });
    }
    this.startSearchOptions();
  }

  filterAddRelationships(data: OptionsEvaluatorElements) {

    let relationshipSet: Array<OptionsElements> = JSON.parse(sessionStorage.getItem("relationshipSetChange"));
    let departmentId: number = this.formInput.controls.DepartmentId.value;

    let object: OptionsElements = { name: data.name, id: data.id, departmentId: departmentId, typeList: data.typeList };

    if (relationshipSet.filter(option => option.id == data.id && option.departmentId == departmentId).length === 0) { relationshipSet.push(object); }

    sessionStorage.setItem('relationshipSetChange', JSON.stringify(relationshipSet));
    this.dataSourceEvaluatorRelationship = new MatTableDataSource(relationshipSet);

    this.dataSourceEvaluatorRelationship = new MatTableDataSource(this.dataSourceEvaluatorRelationship.data.filter(option => option.departmentId == departmentId));
    this.dataSourceEvaluatorDefined = new MatTableDataSource(this.dataSourceEvaluatorDefined.data.filter(option => option.id != data.id));

    if (this.dataSourceEvaluatorDefined.data.length > 0) {
      this.dataSourceEvaluatorDefined.data.forEach(element => {
        this.dataSourceEvaluatorRelationship = new MatTableDataSource(this.dataSourceEvaluatorRelationship.data.filter(option => option.id != element.id));
      });
    }

  }

  filterRemoveRelationships(data: OptionsElements) {
    let evaluatorSet = JSON.parse(sessionStorage.getItem("evaluatorSet"));
    this.dataSourceEvaluatorDefined = new MatTableDataSource(evaluatorSet);

    this.dataSourceEvaluatorDefined = new MatTableDataSource(this.dataSourceEvaluatorDefined.data.filter(option => option.departmentId != this.formInput.controls.DepartmentId.value));
    this.dataSourceEvaluatorRelationship = new MatTableDataSource(this.dataSourceEvaluatorRelationship.data.filter(option => option.id != data.id));

    if (this.dataSourceEvaluatorRelationship.data.length > 0) {
      this.dataSourceEvaluatorRelationship.data.forEach(element => {
        this.dataSourceEvaluatorDefined = new MatTableDataSource(this.dataSourceEvaluatorDefined.data.filter(option => option.id != element.id));
      });
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

  applyEvaluatorRelationshipFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEvaluatorRelationship.filter = filterValue.trim().toLowerCase();
  }

  applyEvaluatorDefinedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceEvaluatorDefined.filter = filterValue.trim().toLowerCase();
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
    }, 2000);
  }

  showTable() {
    this.accessCloseChange = true;
    this.messageAction = 'Realmente deseja sair da edição?';
    if (this.statusShowInput == true) { this.openConfirmAction(); }
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
    this.ListsUpdate();
    this.formDeclaration();
    this.startArrayOptions();
    this.startSearchOptions();
  }
  closeTable() { this.statusShowTable = false; }

  openRegister() {
    this.statusShowInput = true;
    this.closeTable();
    this.startSearchOptions();
  }
  closeRegister() { this.statusShowInput = false; }

  openConfirmAction() { this.statusConfirmAction = true; }
  closeConfirmAction() { this.statusConfirmAction = false; }

  formDeclaration() {
    this.formInput = this.formBuilder.group({
      DepartmentId: [null, Validators.required]
      , DepartmentName: [null, Validators.required]
    });
  }
}
