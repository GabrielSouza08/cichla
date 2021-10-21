import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';
import { MatTableDataSource } from '@angular/material/table';

export interface LocalElements {
  id: number;
  name: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}


@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowImport: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;


  public dataSource = new MatTableDataSource<LocalElements>()
  public displayedColumns: string[] = ["name", "registerDate", "changeDate", "update", "remove"];
  public rows: LocalElements[] = [];
  public messages: Array<string> = [];
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

  constructor(private formBuilder: FormBuilder, private localService: LocalService) { }

  ngOnInit() {
    this.getListLocal();
    this.formDeclaration(); 
    this.getDataUser();

  }

  getListLocal() {
    this.statusLoading = true;

    this.localService.Get().subscribe(res => {
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

  change(row?: LocalElements) {

    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Local.setValue(row.name);
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

  getDataUser() {
    this.dataUser = JSON.parse(sessionStorage.getItem("userInfo"));
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


  delete(row?: LocalElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover o local ' + row.name + '?';
    this.openConfirmAction();
  }

  ActionRemove(value: number) {

    this.accessActionRemove = false;
    this.idRemove = 0;
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.localService.Remove(value, this.dataUser.id).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Local removido!');
          this.getListLocal();

        } else {
          this.openTable();
          res.data.forEach(data => { this.showMessageError(data.message); });
        }
      });
    } else { this.showMessageSucceess('Ok!'); }
  }

  inputChange() {
    this.statusLoading = true;
    if (this.formChange.controls.Local.valid) {
      this.localService.Change(this.dataUser.id, this.formChange.controls.ID.value, this.formChange.controls.Local.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Local atualizado!');
          this.getListLocal();

        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    } else { this.showMessageError('Preencha o campo obrigatório!'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Local.valid) {
      this.localService.Input(this.dataUser.id, this.formInput.controls.Local.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Local cadastrado!');
          this.getListLocal();

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
    this.getListLocal();
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

  openConfirmAction() { this.statusConfirmAction = true; }
  closeConfirmAction() { this.statusConfirmAction = false; }

  formDeclaration() {
    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , Local: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });


    this.formInput = this.formBuilder.group({
      ID: [null, Validators.required]
      , Local: [null, Validators.required]
      , DateRegister: [null, Validators.required]
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
