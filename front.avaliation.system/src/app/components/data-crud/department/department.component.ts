import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DepartmentService } from 'src/app/services/department.service';
import { MatTableDataSource } from '@angular/material/table';


export interface DepartmentElements {
  id: number;
  name: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

let dataDepartment: Array<DepartmentElements> = [{
  id: 1,
  name: '',
  registerDate: '',
  changeDate: '',
  statusCode:1 
}] 

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit {

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowImport: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSource = new MatTableDataSource<DepartmentElements>()
  public displayedColumns: string[] = ["name", "registerDate", "remove"];
  public rows: DepartmentElements[] = [];
  public messages: Array<string> = []
  public array: Array<any>;
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

  constructor(private formBuilder: FormBuilder, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getListDepartment();
    this.formDeclaration();
    this.getDataUser()
  }

  getListDepartment() {
    this.statusLoading = true;

    this.departmentService.Get().subscribe(res => {
      if (res.success == true) {

        this.rows = res.data;
        this.dataSource = new MatTableDataSource(this.rows);

        this.statusLoading = false;
        this.openTable();

      } else {
        this.openTable();
        res.data.forEach(data => { this.showMessageError(data.message); });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
  }

  change(row?: DepartmentElements) {

    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Department.setValue(row.name);
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

  getValueAction(value: boolean) {
    this.accessAction = value;

    switch (true) {
      case this.accessActionRemove: {
        this.ActionRemove(this.idRemove);
        break;
      }
    }
  }

  delete(row?: DepartmentElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover o departamento ' + row.name + '?';
    this.openConfirmAction();
  }

  ActionRemove(value: number) {

    this.accessActionRemove = false;
    this.idRemove = 0;
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.departmentService.Remove(value, this.dataUser.id).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Departamento removido!');
          setTimeout(() => {
            this.getListDepartment();
          }, 1000);
        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    } else { this.showMessageSucceess('Ok!'); }
  }

  inputChange() {
    this.statusLoading = true;
    if (this.formChange.controls.Department.valid) {
      this.departmentService.Change(this.dataUser.id, this.formChange.controls.ID.value, this.formChange.controls.Department.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Departamento atualizado!');
          
          setTimeout(() => {
            this.getListDepartment();
          }, 10000);

        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    } else { this.showMessageError('Preencha o campo obrigatório!'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Department.valid) {
      this.departmentService.Input(this.dataUser.id, this.formInput.controls.Department.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Departamento cadastrado!');
          setTimeout(() => {
            this.getListDepartment();
          }, 1000);

        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    } else { this.showMessageError('Preencha o campo obrigatório!'); }
  }

  inputImport() {
    this.statusLoading = true;
    this.formImport.controls.File.setValue(this.file)

    console.log('dados de submição de importação', this.formImport.controls.File.value);

    //  res.data.forEach(data => { this.showMessageError.push(data.message);});

    this.showMessageSucceess('Importação solicitada!');
    this.showMessageError('TESTEEEEEEE MESSAGEM DE ERRO!');
    this.getListDepartment();
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
  }
  closeChange() { this.statusShowChange = false; }

  openRegister() {
    this.statusShowInput = true;
    this.closeTable();
    this.closeChange();
    this.closeImport();
    this.formDeclaration();
  }
  closeRegister() { this.statusShowInput = false; }

  openImport() {
    this.statusShowImport = true;
    this.closeTable();
    this.closeChange();
    this.closeRegister();
    this.formDeclaration();
  }
  closeImport() { this.statusShowImport = false; }

  openConfirmAction() {
    this.statusConfirmAction = true;
  }
  closeConfirmAction() { this.statusConfirmAction = false; }

  formDeclaration() {
    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , Department: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });


    this.formInput = this.formBuilder.group({
      Department: [null, Validators.required]
    });

    this.formImport = this.formBuilder.group({
      File: [null, Validators.required]
      , TypeImport: [null, Validators.required]
    });
  }

  checkLoading() {
    this.statusLoading = !this.statusLoading;
  }
}
