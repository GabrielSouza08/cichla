
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScalesService } from 'src/app/services/scales.service';
import { MatTableDataSource } from '@angular/material/table';

export interface Scale{
  id: string;
  name: string;
  grade: number;
}

@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.css']
})
export class ScalesComponent implements OnInit {
  
    public statusShowTable: boolean = false;
    public statusShowChange: boolean = false;
    public statusShowInput: boolean = false;
    public statusShowImport: boolean = false;
    public statusLoading: boolean = false;
    public statusMessage: boolean = false;
    public statusSuccess: boolean = false;
    public statusConfirmAction: boolean = false;
  
  
    public dataSource = new MatTableDataSource<Scale>()
    public displayedColumns: string[] = ["name", "grade", "update"];
    public rows: Array<Scale> = [];
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
  
    constructor(private formBuilder: FormBuilder, private scaleService: ScalesService) { }
  
    ngOnInit() {
      this.getListScales();
      this.formDeclaration();
      this.getDataUser();
    }
  
    getListScales() {
      this.statusLoading = true;
  
      this.scaleService.Get().subscribe(res => {
        if (res.success == true) {
  
          this.rows = res.data;
          this.dataSource = new MatTableDataSource(this.rows);
  
          this.statusLoading = false;
          this.openTable();
  
        } else {
          this.openTable();
          res.msg.forEach(message => { this.showMessageError(message.text); });
        }
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    change(row?: Scale) {
  
      this.formChange.controls.ID.setValue(row.id);
      this.formChange.controls.Name.setValue(row.name);
      this.formChange.controls.Grade.setValue(row.grade);
  
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
  
    inputChange() {
      this.statusLoading = true;
      if (this.formChange.controls.Name.valid) {
        this.scaleService.Change(this.formChange.controls.ID.value, this.formChange.controls.Name.value).subscribe(res => {
          if (res.success == true) {
  
            this.showMessageSucceess('Escala atualizada!');
           
            setTimeout(() => {
              this.getListScales();
            }, 1500);
  
          } else { res.msg.forEach(message => { this.showMessageError(message.text); });}
        });
      } else { this.showMessageError('O campo obrigatório não está válido!'); }
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
        , Name: [null, Validators.required]
        , Grade: [null, Validators.required]
      });
  
  
      this.formInput = this.formBuilder.group({
        ID: [null, Validators.required]
        , Name: [null, Validators.required]
        , Grade: [null, Validators.required]
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
  