import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { AreaService } from 'src/app/services/area.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { LocalService } from 'src/app/services/local.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from "rxjs";
import { map, startWith, take, takeUntil } from "rxjs/operators";
import { element } from 'protractor';

export interface CollaboratorElements {
  id: number;
  name: string;
  email: string;
  userName: string;
  evaluatorName: string;
  evaluatorId: number;
  profileName: string;
  profileId: number;
  localName: string;
  localId: number;
  departmentName: string;
  departmentId: number;
  areaName: string;
  areaId: number;
  responsibilityName: string;
  responsibilityId: number;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface OptionsElements {
  id: number;
  name: string;
}


export interface OptionsEvaluatorElements {
  id: number;
  name: string;
  responsibilityName: string;
  departmentId: number;
}

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.css']
})

export class CollaboratorComponent implements OnInit {
  public myControl = new FormControl();

  public filteredEvaluator: Observable<Array<OptionsEvaluatorElements>>;
  public filteredLocal: Observable<Array<OptionsElements>>;
  public filteredDepartment: Observable<Array<OptionsElements>>;
  public filteredArea: Observable<Array<OptionsElements>>;
  public filteredResponsibility: Observable<Array<OptionsElements>>;
  public filteredProfile: Observable<Array<OptionsElements>>;

  public evaluatorFilterCtrl: FormControl = new FormControl();
  public localFilterCtrl: FormControl = new FormControl();
  public departmentFilterCtrl: FormControl = new FormControl();
  public areaFilterCtrl: FormControl = new FormControl();
  public responsibilityFilterCtrl: FormControl = new FormControl();
  public profileFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowImport: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSource = new MatTableDataSource<CollaboratorElements>()
  // public displayedColumns: string[] = ["name", "userName", "email", "evaluatorName", "profileName", "localName", "departmentName", "areaName", "responsibilityName", "registerDate", "changeDate", "update", "remove"];
  public displayedColumns: string[] = ["name", "userName", "evaluatorName", "localName", "departmentName", "update", "remove"];
  public rowsCollaborator: CollaboratorElements[] = [];

  public evaluatorSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: 0, responsibilityName: 'Indeterminado', departmentId: 0 }];
  public evaluatorBackupSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: 0, responsibilityName: 'Indeterminado', departmentId: 0 }];
  public listDepartments: Array<number> = [];
  public localSet: Array<OptionsElements> = [];
  public departmentSet: Array<OptionsElements> = [];
  public areaSet: Array<OptionsElements> = [];
  public responsibilitySet: Array<OptionsElements> = [];
  public profileSet: Array<OptionsElements> = [];

  public messages: Array<string> = []
  public messageSuccess: string;
  public messageAction: string;

  public formInput: FormGroup;
  public formChange: FormGroup;
  public formImport: FormGroup;

  public file: Set<File>;
  public progress: number = 0;

  public dataUser: any;

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public idRemove: number;

  constructor(private formBuilder: FormBuilder, private collaboratorService: ColaboratorService, private areaService: AreaService, private departmentService: DepartmentService, private responsibilityService: ResponsibilityService, private localService: LocalService) { }

  ngOnInit() {
    this.getListCollaborator();
    this.ListsUpdate();
    this.formDeclaration();
    this.getDataUser();
    this.startSearchOptions();
  }

  ListsUpdate() {
    this.getListEvaluator();
    this.getListLocal();
    this.getListDepartment();
    this.getListArea();
    this.getListResponsibility();
    this.getListProfile();
  }

  getListCollaborator() {
    this.statusLoading = true;
    this.collaboratorService.Get().subscribe(res => {
      if (res.success == true) {

        this.rowsCollaborator = res.data;
        this.dataSource = new MatTableDataSource(this.rowsCollaborator);

        this.statusLoading = false;
        this.openTable();

      } else {
        this.openTable();
        res.data.forEach(data => { this.showMessageError(data.message); });
      }
    });
  }

  getListEvaluator() {
    var row: OptionsEvaluatorElements;
    var list: Array<OptionsEvaluatorElements> = [];

    this.collaboratorService.GetEvaluator().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(element => {
          row = {
            id: element.id,
            name: element.name,
            responsibilityName: element.responsibilityName,
            departmentId: element.departmentId
          };
          if (row != undefined) { list.push(row); }
        });
        this.evaluatorSet = list;
        this.evaluatorBackupSet = list;
      }
    });
  }

  getListLocal() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];

    this.localService.Get().subscribe(res => {


      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            name: element.name,
            id: element.id
          };
          if (row) { list.push(row); }
        });
        this.localSet = list;
      }
    });
  }

  getListDepartment() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];

    this.departmentService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            name: element.name,
            id: element.id
          };
          if (row) { list.push(row); }
        });
        this.departmentSet = list;
        this.listdepartmentSuccess();
      }
    });
  }

  listdepartmentSuccess() {
    let list: Array<number> = [];
    this.departmentSet.forEach(function (value) {
      switch (value.name) {
        case 'diretoria':
        case 'Diretoria':
        case 'superintendência':
        case 'Superintendência':
        case 'superintendencia':
        case 'Superintendencia':
          {
            list.push(value.id)
          }
      };
    });
    this.listDepartments = list;
  }

  getListArea() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];
    this.areaService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            name: element.name,
            id: element.id
          };
          if (row) { list.push(row); }
        });
        this.areaSet = list;
      }
    });
  }

  getListResponsibility() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];
    this.responsibilityService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            name: element.name,
            id: element.id
          };
          if (row) { list.push(row); }
        });
        this.responsibilitySet = list;
      }
    });
  }

  getListProfile() {
    let row: OptionsElements;
    let list: Array<OptionsElements> = [];
    this.collaboratorService.GetProfile().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            name: element.name,
            id: element.id
          };
          if (row) { list.push(row); }
        });
        this.profileSet = list;
      }
    });
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  restartArrayOptions() {
    this.evaluatorSet = this.evaluatorBackupSet;
  }

  change(row?: CollaboratorElements) {
    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Collaborator.setValue(row.name);
    this.formChange.controls.UserName.setValue(row.userName);
    this.formChange.controls.Email.setValue(row.email);
    this.formChange.controls.EvaluatorId.setValue(row.evaluatorId);
    this.formChange.controls.EvaluatorName.setValue(row.evaluatorName);
    this.formChange.controls.ProfileId.setValue(row.profileId);
    this.formChange.controls.ProfileName.setValue(row.profileName);
    this.formChange.controls.LocalId.setValue(row.localId);
    this.formChange.controls.LocalName.setValue(row.localName);
    this.formChange.controls.DepartmentId.setValue(row.departmentId);
    this.formChange.controls.DepartmentName.setValue(row.departmentName);
    this.formChange.controls.AreaId.setValue(row.areaId);
    this.formChange.controls.AreaName.setValue(row.areaName);
    this.formChange.controls.ResponsibilityId.setValue(row.responsibilityId);
    this.formChange.controls.ResponsibilityName.setValue(row.responsibilityName);
    this.formChange.controls.DateRegister.setValue(row.registerDate);

    this.openChange();
  }

  getFile(event) {
    if (event != '' || event != null) {
      const selectedFiles = <FileList>event.srcElement.files;
      const fileNames = [];
      this.file = new Set();
      for (let i = 0; i < selectedFiles.length; i++) {
        fileNames.push(selectedFiles[i].name);
        this.file.add(selectedFiles[i]);
      }
      this.progress = 0;
    }
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

  delete(row?: CollaboratorElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover o(a) colaborador(a) ' + row.name + '?';
    this.openConfirmAction();
  }

  ActionRemove(value: number) {

    this.accessActionRemove = false;
    this.idRemove = 0;
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.collaboratorService.Remove(value, this.dataUser.id).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Remoção concluída!');
          this.getListCollaborator();
          this.ListsUpdate();

        } else {
          this.openTable();
          res.data.forEach(data => { this.showMessageError(data.message); });
        }
      });
    } else { this.showMessageSucceess('Ok!'); }
  }

  inputChange() {
    this.statusLoading = true;
    if (this.formChange.controls.Collaborator.valid && this.formChange.controls.Email.valid && this.formChange.controls.ProfileId.valid && this.formChange.controls.LocalId.valid && this.formChange.controls.DepartmentId.valid && this.formChange.controls.AreaId.valid && this.formChange.controls.ResponsibilityId.valid) {
      this.collaboratorService.
        Change(
          this.dataUser.id,
          this.formChange.controls.ID.value,
          this.formChange.controls.Collaborator.value,
          this.formChange.controls.Email.value,
          this.formChange.controls.UserName.value,
          this.formChange.controls.EvaluatorId.value,
          this.formChange.controls.ProfileId.value,
          this.formChange.controls.LocalId.value,
          this.formChange.controls.DepartmentId.value,
          this.formChange.controls.AreaId.value,
          this.formChange.controls.ResponsibilityId.value,
        ).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Aualização concluída!');
            this.getListCollaborator();
            this.ListsUpdate();

          } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Collaborator.valid && this.formInput.controls.Email.valid, this.formInput.controls.ProfileId.valid && this.formInput.controls.LocalId.valid && this.formInput.controls.DepartmentId.valid && this.formInput.controls.AreaId.valid && this.formInput.controls.ResponsibilityId.valid) {
      this.collaboratorService.
        Input(
          this.dataUser.id,
          this.formInput.controls.Collaborator.value,
          this.formInput.controls.Email.value,
          this.formInput.controls.UserName.value,
          this.formInput.controls.EvaluatorId.value,
          this.formInput.controls.ProfileId.value,
          this.formInput.controls.LocalId.value,
          this.formInput.controls.DepartmentId.value,
          this.formInput.controls.AreaId.value,
          this.formInput.controls.ResponsibilityId.value,
        ).subscribe(res => {
          if (res.success == true) {

            this.showMessageSucceess('Cadastro concluído!');
            this.getListCollaborator();
            this.ListsUpdate();

          } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
        });
    } else { this.showMessageError('Preencha os campos obrigatórios'); }
  }

  inputImport() {
    this.statusLoading = true;
    this.formImport.controls.File.setValue(this.file)

    console.log('dados de submição de importação', this.formImport.controls.File.value);

    this.showMessageSucceess('Importação solicitada!');
    this.showMessageError('TESTEEEEEEE MESSAGEM DE ERRO!');
    this.getListCollaborator();
  }

  startSearchOptions() {

    this.formChange.controls.DepartmentId.valueChanges.pipe(
      startWith(""),
      map(value => this.filterListEvaluator(value))
    );

    this.formChange.get("DepartmentId").valueChanges.subscribe(value => {

      setTimeout(() => {
        this.filterListEvaluator(value);  //shows the latest first name
      })
    });

    this.formInput.controls.DepartmentId.valueChanges.pipe(
      startWith(""),
      map(value => this.filterListEvaluator(value))
    );

    this.formInput.get("DepartmentId").valueChanges.subscribe(value => {

      setTimeout(() => {
        this.filterListEvaluator(value);  //shows the latest first name
      })
    });

    this.formChange.controls.EvaluatorName.valueChanges.pipe(
      startWith(""),
      map(value => this.evaluatorFilterCtrl.setValue(value))
    );

    this.filteredEvaluator = this.evaluatorFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterEvaluator(value))
    );

    this.formChange.controls.LocalName.valueChanges.pipe(
      startWith(""),
      map(value => this.localFilterCtrl.setValue(value))
    );

    this.filteredLocal = this.localFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterLocal(value))
    );

    this.formChange.controls.DepartmentName.valueChanges.pipe(
      startWith(""),
      map(value => this.departmentFilterCtrl.setValue(value))
    );

    this.filteredDepartment = this.departmentFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterDepartment(value))
    );

    this.formChange.controls.AreaName.valueChanges.pipe(
      startWith(""),
      map(value => this.areaFilterCtrl.setValue(value))
    );

    this.filteredArea = this.areaFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterArea(value))
    );

    this.formChange.controls.ResponsibilityName.valueChanges.pipe(
      startWith(""),
      map(value => this.responsibilityFilterCtrl.setValue(value))
    );

    this.filteredResponsibility = this.responsibilityFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterResponsibility(value))
    );

    this.formChange.controls.ProfileName.valueChanges.pipe(
      startWith(""),
      map(value => this.profileFilterCtrl.setValue(value))
    );

    this.filteredProfile = this.profileFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterProfile(value))
    );



  }


  // Filtro de avaliadores com base no departamento
  // OBS: o padrão são os departamentos da diretoria e superintendência. 
  filterListEvaluator(value: number = 0) {
    this.restartArrayOptions();

    const filterValue = value.toString();

    if (this.evaluatorSet.filter(option => option.id.toString().indexOf(this.formChange.controls.ID.value) === 0).length == 0) {
      this.evaluatorSet = this.evaluatorSet.filter(option => option.departmentId.toString().indexOf(filterValue) === 0);
    } else {
      let listEvaluatorsAll: Array<OptionsEvaluatorElements> = [];

      listEvaluatorsAll = this.evaluatorSet.filter(option => option.departmentId.toString().indexOf(filterValue) === 0);

      this.evaluatorSet = Array<OptionsEvaluatorElements>();

      if (listEvaluatorsAll.length > 0) {
        listEvaluatorsAll.forEach(element => {
          if (element.id != this.formChange.controls.ID.value) {
            this.evaluatorSet.push(element);
          }
        });
      }
    }

    if (this.listDepartments.length > 0) {
      let listEvaluators: Array<OptionsEvaluatorElements> = [];
      this.listDepartments
        .forEach(id => {
          listEvaluators = this.evaluatorBackupSet.filter(option => option.departmentId.toString().indexOf(id.toString()) === 0);

          if (listEvaluators.length > 0) {
            listEvaluators.forEach(element => {
              if (this.evaluatorSet.filter(option => option.name.indexOf(element.name) === 0).length == 0) {
                this.evaluatorSet.push(element);
              }
            });
          }
        });
    }
    if(this.evaluatorSet.filter(op => op.id == this.formChange.controls.ID.value).length > 0){ this.evaluatorSet = this.evaluatorSet.filter(op => op.id != this.formChange.controls.ID.value); }


    if(this.evaluatorSet.filter(op => op.id == 0).length == 0){ this.evaluatorSet.push({ name: 'Indeterminado', id: 0, responsibilityName: 'Indeterminado', departmentId: 0 }); }

    this.startSearchOptions();
  }

  filterEvaluator(value: string = ''): Array<OptionsEvaluatorElements> {
    const filterValue = value.toLowerCase();
    return this.evaluatorSet.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  filterProfile(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.profileSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterLocal(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.localSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterDepartment(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.departmentSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterArea(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.areaSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterResponsibility(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.responsibilitySet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  checkLoading() {
    this.statusLoading = !this.statusLoading;
  }

  openTable() {
    this.statusShowTable = true;
    this.closeChange();
    this.closeRegister();
    this.closeImport();
  }
  closeTable() { this.statusShowTable = false; }

  openChange() {
    this.statusShowChange = true;
    this.closeTable();
    this.closeRegister();
    this.closeImport();
    this.startSearchOptions();
  }
  closeChange() { this.statusShowChange = false; }

  openRegister() {
    this.statusShowInput = true;
    this.closeTable();
    this.closeChange();
    this.closeImport();
    this.formDeclaration();
    this.startSearchOptions();
  }
  closeRegister() { this.statusShowInput = false; }

  openImport() {
    this.statusShowImport = true;
    this.closeTable();
    this.closeChange();
    this.closeRegister();
    this.formDeclaration();
    this.restartArrayOptions();
  }
  closeImport() { this.statusShowImport = false; }

  openConfirmAction() { this.statusConfirmAction = true; }
  closeConfirmAction() { this.statusConfirmAction = false; }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formDeclaration() {
    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , Collaborator: [null, Validators.required]
      , UserName: [null, Validators.required]
      , Email: [null, Validators.required]
      , EvaluatorId: [null]
      , EvaluatorName: [null]
      , LocalId: [null, Validators.required]
      , LocalName: [null, Validators.required]
      , DepartmentId: [null, Validators.required]
      , DepartmentName: [null, Validators.required]
      , AreaId: [null, Validators.required]
      , AreaName: [null, Validators.required]
      , ResponsibilityId: [null, Validators.required]
      , ResponsibilityName: [null, Validators.required]
      , ProfileId: [null, Validators.required]
      , ProfileName: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });

    this.formInput = this.formBuilder.group({
      Collaborator: [null, Validators.required]
      , UserName: [null, Validators.required]
      , Email: [null, Validators.required]
      , EvaluatorId: [null]
      , EvaluatorName: [null]
      , LocalId: [null, Validators.required]
      , LocalName: [null, Validators.required]
      , DepartmentId: [null, Validators.required]
      , DepartmentName: [null, Validators.required]
      , AreaId: [null, Validators.required]
      , AreaName: [null, Validators.required]
      , ResponsibilityId: [null, Validators.required]
      , ResponsibilityName: [null, Validators.required]
      , ProfileId: [null, Validators.required]
      , ProfileName: [null, Validators.required]
    });

    this.formImport = this.formBuilder.group({
      File: [null, Validators.required]
      , TypeImport: [null, Validators.required]
    });
  }
}
