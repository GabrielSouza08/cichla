import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";


export interface PermissionResposibilities {
  id: string;
  responsibilityId: string;
  responsibilityName: string;
  permissionName: string;
  permissionId: string;
  registerDate: string;
}

export interface Permission {
  id: string;
  name: string;
}

export interface Responsibility {
  id: string;
  name: string;
}

export interface ElementsFinal {
  PermissionId: string;
  ResponsibilityId: string;
  Status: string;
}

@Component({
  selector: 'app-relationship-responsibility-permission',
  templateUrl: './relationship-responsibility-permission.component.html',
  styleUrls: ['./relationship-responsibility-permission.component.css']
})
export class RelationshipResponsibilityPermissionComponent implements OnInit {
  public filteredPermission: Observable<Array<Permission>>;
  public filteredResponsibility: Observable<Array<Responsibility>>;

  public responsibilityFilterCtrl: FormControl = new FormControl();
  public permissionFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowInput: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourcePermission = new MatTableDataSource<Permission>();
  public dataSourcePermissionResposibility = new MatTableDataSource<PermissionResposibilities>();
  public dataSourceResposibility = new MatTableDataSource<Responsibility>();

  public displayedColumnsPermission: string[] = ["name"];
  public displayedColumnsPermissionResponsibility: string[] = ["responsibilityName", "remove"];
  public displayedColumnsResponsibility: string[] = ["name", "input"]; 

  public rowsPermission: Array<Permission> = [{ id: '0', name: 'Não encontrado'}];
  public rowsPermissionResposibility: Array<PermissionResposibilities> = [];
  public rowsResposibilityDefined: Array<Responsibility> = [];

  public responsibilitySet: Array<Responsibility> = [{ id: '0', name: 'Indeterminado'}];
  public responsibilityBackupSet: Array<Responsibility> = [{ id: '0', name: 'Indeterminado'}];
  public permissionSet: Array<Permission> = [];
  public permissionResponsibilitySet: Array<PermissionResposibilities> = [];
  public permissionResponsibilityBackupSet: Array<PermissionResposibilities> = [];
  public relationshipCompletion: Array<ElementsFinal> = [];

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

  constructor(private formBuilder: FormBuilder, private responsibilityService: ResponsibilityService) { }


  ngOnInit() {
    this.ListsUpdate();
    this.openTable();
    this.formDeclaration();
    this.startSearchOptions();
  }

  ListsUpdate() {
    this.getPermissionResponsibilibity();
    this.getPermission();
    this.getResponsibilibity();
    this.startDatasources();
  }

  getPermissionResponsibilibity(){
    let row: PermissionResposibilities;
    let list: Array<PermissionResposibilities> = [];

    this.responsibilityService.GetRelationshipResponsibilityPermission().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            permissionId: element.permissionId,
            permissionName: element.permissionName,
            registerDate: element.registerDate,
            responsibilityId: element.responsibilityId,
            responsibilityName: element.responsibilityName
          };
          if (row) { list.push(row); }
        });
        this.permissionResponsibilitySet = list;
        this.dataSourcePermissionResposibility = new MatTableDataSource([...this.permissionResponsibilitySet]);
      }
    });
  }

  getPermission() {
    let row: Responsibility;
    let list: Array<Responsibility> = [];

    this.responsibilityService.GetPermission().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            name: element.name
          };
          if (row) { list.push(row); }
        });
        this.permissionSet = [...list];
        this.dataSourcePermission = new MatTableDataSource([...this.permissionSet]);
      }
    });
  }

  getResponsibilibity() {
    let row: Responsibility;
    let list: Array<Responsibility> = [];

    this.responsibilityService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            name: element.name
          };
          if (row) { list.push(row); }
        });
        this.responsibilitySet = list;
        this.dataSourceResposibility = new MatTableDataSource([...this.responsibilitySet]);
      }
    });
  }

  getLine(row?: Permission) {
    this.formInput.controls.PermissionId.setValue(row.id);
    this.formInput.controls.PermissionName.setValue(row.name);
    this.openRegister();
  }

  remove(row?: PermissionResposibilities) {
    this.filterRemoveResponsibility(row);
  }

  filterRemoveResponsibility(data: PermissionResposibilities) {
    this.dataSourceResposibility = new MatTableDataSource([...this.responsibilitySet]);

    this.dataSourcePermissionResposibility = new MatTableDataSource(this.dataSourcePermissionResposibility.data.filter(option => option.responsibilityId != data.responsibilityId));

    if (this.dataSourcePermissionResposibility.data.length > 0) {
      this.dataSourcePermissionResposibility.data.forEach(element => {
        this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != element.responsibilityId));
      });
    }
    this.dataSourceResposibility._updateChangeSubscription();
    this.dataSourcePermissionResposibility._updateChangeSubscription();
  }

  add(row?: Responsibility) {
    this.filterAddResponsibility(row);
  }
  
  filterAddResponsibility(data: Responsibility){
    let permissionId: string = this.formInput.controls.PermissionId.value;
    let permissionName: string = this.formInput.controls.PermissionName.value;

    let object: PermissionResposibilities = { id:'', responsibilityId: data.id, responsibilityName: data.name, permissionId: permissionId, permissionName: permissionName, registerDate: ''};
    console.log(object)
    this.dataSourcePermissionResposibility.data.push(object);

    this.dataSourcePermissionResposibility.data.forEach(element => {
      this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != element.responsibilityId));
    });

    this.dataSourcePermissionResposibility._updateChangeSubscription()
    this.dataSourceResposibility._updateChangeSubscription()
  }

  inputRegister() {
    this.analyzeDataRequest();
    
    console.log(this.relationshipCompletion)

    if (this.relationshipCompletion.length == 0) { this.showMessageError('Para salvar altere algum dado!'); }
    else {

      this.responsibilityService.InputPermissionResponsibility(this.relationshipCompletion).subscribe(res => {
        if (res.success == true) {

          this.showMessageSucceess('Alteração concluída!');
          setTimeout(() => { this.openTable(); }, 2000);
          
        } else { res.msg.forEach(message => { this.showMessageError(message.text); }); }
      });
    }


    this.relationshipCompletion = new Array<ElementsFinal>();
    this.openTable();
  }

  analyzeDataRequest(){
    let remove: Array<PermissionResposibilities> = [];
    let include: Array<PermissionResposibilities> = [];
    
    this.dataSourcePermissionResposibility.data.forEach(element => {
      if(this.permissionResponsibilitySet.filter( option => option.responsibilityId == element.responsibilityId && 
      option.permissionId == element.permissionId).length == 0 || 
      this.permissionResponsibilitySet.filter(option => option.permissionId == element.permissionId).length == 0){
        include.push(element);
      }
    });

    this.permissionResponsibilitySet.forEach(element => {
      if(this.dataSourcePermissionResposibility.data.filter(option => option.responsibilityId == element.responsibilityId).length == 0 && 
      this.dataSourcePermissionResposibility.data.filter(option => option.permissionId == element.permissionId).length > 0 ||
      this.dataSourcePermissionResposibility.data.length == 0 &&
      this.permissionResponsibilitySet.filter(option => option.permissionId == this.formInput.controls.PermissionId.value).length > 0 &&
      element.permissionId == this.formInput.controls.PermissionId.value){
        remove.push(element);
      }
    });

    if (remove.length > 0) {
      remove.forEach(element => {
        this.relationshipCompletion.push({ PermissionId: element.permissionId, ResponsibilityId: element.responsibilityId, Status: 'Remove' });
      });
    }

    if (include.length > 0) {
      include.forEach(element => {
        this.relationshipCompletion.push({ PermissionId: element.permissionId, ResponsibilityId: element.responsibilityId, Status: 'Include' });
      });
    }

  }
  
  startSearchOptions() {
    this.filteredPermission = this.permissionFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterPermission(value))
    );

    this.formInput.get("PermissionId").valueChanges.subscribe(value => {
      this.filterPermissionResponsibility(value);
    });

    this.formInput.get("PermissionName").valueChanges.subscribe(value => {
      this.permissionFilterCtrl.setValue(value)
    });
  }

  startDatasources() {
    this.dataSourceResposibility = new MatTableDataSource([...this.responsibilitySet]);
    this.dataSourcePermissionResposibility = new MatTableDataSource([...this.permissionResponsibilitySet]);
  }

  filterPermission(value: string = ''): Array<Permission> {
    const filterValue = value.toLowerCase();
    return this.permissionSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterPermissionResponsibility(value: string = '0'){
    this.startDatasources();

    let name = this.permissionSet.filter(option => option.id.toString().indexOf(value) === 0)[0].name
    this.formInput.controls.PermissionName.setValue(name);

    const filterValue = value.toString();

    if (this.dataSourcePermissionResposibility.data.filter(option => option.permissionId.toString().indexOf(filterValue) === 0).length > 0) {
      this.dataSourcePermissionResposibility = new MatTableDataSource(this.dataSourcePermissionResposibility.data.filter(option => option.permissionId.toString().indexOf(filterValue) === 0));

    } else {
      this.dataSourcePermissionResposibility = new MatTableDataSource<PermissionResposibilities>();
    }

    if (this.dataSourcePermissionResposibility.data.length > 0) {
      this.dataSourcePermissionResposibility.data.forEach(element => {
        this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != element.responsibilityId));
      });
    }
  }

  formDeclaration() {
    this.formInput = this.formBuilder.group({
        PermissionId: [null, Validators.required]
      , PermissionName: [null, Validators.required]
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePermission.filter = filterValue.trim().toLowerCase();
  }

  applyPermissionResponsibilityFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePermissionResposibility.filter = filterValue.trim().toLowerCase();
  }

  applyResponsibilityFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceResposibility.filter = filterValue.trim().toLowerCase();
  }
}
