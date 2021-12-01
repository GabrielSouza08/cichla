import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { AreaService } from 'src/app/services/area.service';
import { DepartmentService } from 'src/app/services/department.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from "rxjs";
import { map, startWith, take, takeUntil } from "rxjs/operators";

export interface CollaboratorElements {
  id: string;
  name: string;
  email: string;
  password: string;
  evaluatorName: string;
  evaluatorId: string;
  areaName: string;
  areaId: string;
  responsibilityName: string;
  responsibilityId: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface OptionsElements {
  id: string;
  name: string;
}


export interface OptionsEvaluatorElements {
  id: string;
  name: string;
  responsibilityName: string;
  areaId: string;
}

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.css']
})

export class CollaboratorComponent implements OnInit {
  public myControl = new FormControl();

  toppings: FormGroup;


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
  public displayedColumns: string[] = ["name", "e-mail", "evaluatorName", "update", "remove"];
  public rowsCollaborator: CollaboratorElements[] = [];

  public evaluatorSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: '0', responsibilityName: 'Indeterminado', areaId: '0' }];
  public evaluatorBackupSet: Array<OptionsEvaluatorElements> = [{ name: 'Indeterminado', id: '0', responsibilityName: 'Indeterminado', areaId: '0' }];
  public localSet: Array<OptionsElements> = [];
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

  //public isChangePassword: boolean = false;

  //Controle de ações(Sim ou não)
  public accessAction: boolean;
  public accessActionRemove: boolean;
  public idRemove: string;

  constructor(private formBuilder: FormBuilder, private collaboratorService: ColaboratorService, private areaService: AreaService, private responsibilityService: ResponsibilityService) { }

  ngOnInit() {
    this.getListCollaborator();
    this.ListsUpdate();
    this.formDeclaration();
    this.getDataUser();
    this.startSearchOptions();
  }

  ListsUpdate() {
    this.getListEvaluator();
    this.getListArea();
    this.getListResponsibility();
  }

  getListCollaborator() {
    this.statusLoading = true;
    this.collaboratorService.Get().subscribe(res => {
      if (res.success == true) {

        this.rowsCollaborator = res.data;
        this.dataSource = new MatTableDataSource([...this.rowsCollaborator]);

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

    this.collaboratorService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(element => {
          row = {
            id: element.id,
            name: element.name,
            responsibilityName: element.responsibilityName,
            areaId: element.areaId
          };
          if (row != undefined) { list.push(row); }
        });
        this.evaluatorSet = list;
        this.evaluatorBackupSet = list;
      }
    });
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

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  restartArrayOptions() {
    this.evaluatorSet = this.evaluatorBackupSet;
  }

  change(row?: CollaboratorElements) {
    console.log(row)
    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Collaborator.setValue(row.name);
    this.formChange.controls.Password.setValue('');
    this.formChange.controls.Email.setValue(row.email);
    this.formChange.controls.EvaluatorId.setValue(row.evaluatorId);
    this.formChange.controls.EvaluatorName.setValue(row.evaluatorName);
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

  ActionRemove(value: string) {

    this.accessActionRemove = false;
    this.idRemove ='0';
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
    if (this.formChange.controls.Collaborator.valid && this.formChange.controls.Email.valid && this.formChange.controls.AreaId.valid && this.formChange.controls.ResponsibilityId.valid) {
      this.collaboratorService.
        Change(
          this.dataUser.id,
          this.formChange.controls.ID.value,
          this.formChange.controls.Collaborator.value,
          this.formChange.controls.Email.value,
          this.formChange.controls.Password.value,
          this.formChange.controls.EvaluatorId.value,
          this.formChange.controls.AreaId.value,
          this.formChange.controls.ResponsibilityId.value,
          this.toppings.controls.isChangePassword.value
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
          this.formInput.controls.Password.value,
          this.formInput.controls.EvaluatorId.value,
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
    this.getListCollaborator();
  }

  startSearchOptions() {

    this.formChange.controls.EvaluatorName.valueChanges.pipe(
      startWith(""),
      map(value => this.evaluatorFilterCtrl.setValue(value))
    );

    this.filteredEvaluator = this.evaluatorFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterEvaluator(value))
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
  }

  filterEvaluator(value: string = ''): Array<OptionsEvaluatorElements> {
    const filterValue = value.toLowerCase();
    return this.evaluatorSet.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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
      , Password: [null, Validators.required]
      , Email: [null, Validators.required]
      , EvaluatorId: [null]
      , EvaluatorName: [null]
      , AreaId: [null, Validators.required]
      , AreaName: [null, Validators.required]
      , ResponsibilityId: [null, Validators.required]
      , ResponsibilityName: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });

    this.formInput = this.formBuilder.group({
      Collaborator: [null, Validators.required]
      , Password: [null, Validators.required]
      , Email: [null, Validators.required]
      , EvaluatorId: [null]
      , EvaluatorName: [null]
      , AreaId: [null, Validators.required]
      , AreaName: [null, Validators.required]
      , ResponsibilityId: [null, Validators.required]
      , ResponsibilityName: [null, Validators.required]
    });

    this.formImport = this.formBuilder.group({
      File: [null, Validators.required]
      , TypeImport: [null, Validators.required]
    });

    this.toppings = this.formBuilder.group({
      isChangePassword: false
    });

  }
}
