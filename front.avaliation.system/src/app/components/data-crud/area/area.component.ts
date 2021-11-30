import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AreaService } from 'src/app/services/area.service';
import { DepartmentService } from 'src/app/services/department.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable} from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface AreaElements {
  id: number;
  name: string;
  departmentId: string;
  departmentName: string;
  registerDate: string;
  changeDate: string;
  statusCode: number;
}

export interface OptionsElements {
  id: number;
  name: string;
}

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  public myControl = new FormControl();

  public departmentSet: Array<OptionsElements> = [];

  public filteredDepartment: Observable<Array<OptionsElements>>;

  public departmentFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowImport: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSource = new MatTableDataSource<AreaElements>()
  public displayedColumns: Array<string> = ["name", "registerDate", "remove"];
  public rows: Array<AreaElements> = [];
  public rowsDepartment: Array<AreaElements> = [];
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


  constructor(private formBuilder: FormBuilder, private areaService: AreaService, private departmentService: DepartmentService ) { }

  ngOnInit() {
    this.getListDepartment();
    this.getListArea();
    this.formDeclaration();
    this.getDataUser();
    this.startSearchOptions();
  }

  getListArea() {
    
    this.areaService.Get().subscribe(res => {
      if (res.success == true) {

        this.rows = res.data;
        this.dataSource = new MatTableDataSource(this.rows);

        this.statusLoading = false;
        this.openTable();

      } else {
        this.openTable();
        res.msg.forEach(mesage => { this.showMessageError(mesage.text); });
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
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  change(row?: AreaElements) {
    this.formChange.controls.ID.setValue(row.id);
    this.formChange.controls.Area.setValue(row.name);
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

  delete(row?: AreaElements) {
    this.accessActionRemove = true;
    this.idRemove = row.id;
    this.messageAction = 'Realmente quer remover a área ' + row.name + '?';
    this.openConfirmAction();
  }

  ActionRemove(value: number) {

    this.accessActionRemove = false;
    this.idRemove = 0;
    this.messageAction = '';
    this.closeConfirmAction();
    this.statusLoading = true;

    if (this.accessAction) {
      this.areaService.Remove(value).subscribe(res => {
        this.statusLoading = false;
        if (res.success == true) {

          this.showMessageSucceess('Área removida!');
          setTimeout(() => { this.getListArea();}, 1500);

        } else {
          this.openTable();
          res.msg.forEach(message => { this.showMessageError(message.text); });
        }
      });
    } else { this.showMessageSucceess('Ok!'); }
  }

  inputChange() {
    this.statusLoading = true;
    if (this.formChange.controls.Area.valid) {
      this.areaService.Change(this.dataUser.id, this.formChange.controls.ID.value, this.formChange.controls.Area.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Área atualizada!');
          setTimeout(() => { this.getListArea();}, 1500);

        } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
      });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  inputRegister() {
    this.statusLoading = true;
    if (this.formInput.controls.Area.valid, this.formInput.controls.DepartmentId.valid) {
      this.areaService.Input(this.formInput.controls.Area.value, this.formInput.controls.DepartmentId.value).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Área cadastrada!');
          setTimeout(() => { this.getListArea();}, 1500);

        } else { res.data.forEach(data => { this.showMessageError(data.message); }); }
      });
    } else { this.showMessageError('Preencha os campos obrigatórios!'); }
  }

  inputImport() {
    this.statusLoading = true;
    this.formImport.controls.File.setValue(this.file)

    console.log('dados de submição de importação', this.formImport.controls.File.value);

    //  res.data.forEach(data => { this.showMessageError.push(data.message);});

    this.showMessageSucceess('Importação solicitada!');
    this.showMessageError('TESTEEEEEEE MESSAGEM DE ERRO!');
    this.getListArea();
  }

  startSearchOptions() {
    this.filteredDepartment = this.departmentFilterCtrl.valueChanges.pipe(
      startWith(""),
      map(value => this.filterDepartment(value))
    );

    this.formInput.controls.DepartmentId.valueChanges.pipe(
      startWith(""),
      map(value => this.departmentFilterCtrl.setValue(value))
    );

    this.formInput.get("DepartmentId").valueChanges.subscribe(value => {

      setTimeout(() => {
        this.departmentFilterCtrl.setValue(value);  //shows the latest first name
      })
    });
  }

  filterDepartment(value: string = ''): Array<OptionsElements> {
    const filterValue = value.toLowerCase();
    return this.departmentSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
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
      , Area: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });


    this.formInput = this.formBuilder.group({
        Area: [null, Validators.required]
      , DepartmentId: [null, Validators.required]
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
