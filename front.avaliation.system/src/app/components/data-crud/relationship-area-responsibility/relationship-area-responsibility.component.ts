import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColaboratorService } from 'src/app/services/colaborator.service';
import { AreaService } from 'src/app/services/area.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface AreaResposibilities {
  id: string;
  responsibilityId: string;
  responsibilityName: string;
  areaName: string;
  areaId: string;
  registerDate: string;
}

export interface Area {
  id: string;
  name: string;
}

export interface Responsibility {
  id: string;
  name: string;
}

export interface ElementsFinal {
  AreaId: number;
  ResponsabilityId: number;
  Status: string;
}

@Component({
  selector: 'app-relationship-area-responsibility',
  templateUrl: './relationship-area-responsibility.component.html',
  styleUrls: ['./relationship-area-responsibility.component.css']
})
export class RelationshipAreaResponsibilityComponent implements OnInit {

  public filteredArea: Observable<Array<Area>>;
  public filteredResponsibility: Observable<Array<Responsibility>>;

  public responsibilityFilterCtrl: FormControl = new FormControl();
  public areaFilterCtrl: FormControl = new FormControl();

  public statusShowTable: boolean = false;
  public statusShowInput: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;
  public statusSuccess: boolean = false;
  public statusConfirmAction: boolean = false;

  public dataSourceArea = new MatTableDataSource<Area>();
  public dataSourceAreaResposibility = new MatTableDataSource<AreaResposibilities>();
  public dataSourceResposibility = new MatTableDataSource<Responsibility>();

  public displayedColumnsArea: string[] = ["name"];
  public displayedColumnsAreaResponsibility: string[] = ["responsibilityName", "remove"];
  public displayedColumnsResponsibility: string[] = ["name", "input"]; 

  public rowsArea: Array<Area> = [{ id: '0', name: 'Não encontrado'}];
  public rowsAreaResposibility: Array<AreaResposibilities> = [];
  public rowsResposibilityDefined: Array<Responsibility> = [];

  public responsibilitySet: Array<Responsibility> = [{ id: '0', name: 'Indeterminado'}];
  public responsibilityBackupSet: Array<Responsibility> = [{ id: '0', name: 'Indeterminado'}];
  public areaSet: Array<Area> = [];
  public areaResponsibilitySet: Array<AreaResposibilities> = [];
  public areaResponsibilityBackupSet: Array<AreaResposibilities> = [];
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

  constructor(private formBuilder: FormBuilder, private collaboratorService: ColaboratorService, private areaService: AreaService, private responsibilityService: ResponsibilityService) { }


  ngOnInit() {
    this.ListsUpdate();
    this.openTable();
    this.formDeclaration();
    this.startSearchOptions();
  }

  ListsUpdate() {
    this.getAreaResponsibilibity();
    this.getArea();
    this.getResponsibilibity();
    this.startDatasources();
  }

  getAreaResponsibilibity(){
    let row: AreaResposibilities;
    let list: Array<AreaResposibilities> = [];

    this.responsibilityService.GetRelationshipResponsibilityArea().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            areaId: element.areaId,
            areaName: element.areaName,
            registerDate: element.registerDate,
            responsibilityId: element.responsibilityId,
            responsibilityName: element.responsibilityName
          };
          if (row) { list.push(row); }
        });
        this.areaResponsibilitySet = list;
        this.dataSourceAreaResposibility = new MatTableDataSource([...this.areaResponsibilitySet]);
      }
    });
  }

  getArea() {
    let row: Responsibility;
    let list: Array<Responsibility> = [];

    this.areaService.Get().subscribe(res => {
      if (res.success == true) {
        res.data.forEach(function (element) {
          row = {
            id: element.id,
            name: element.name
          };
          if (row) { list.push(row); }
        });
        this.areaSet = list;
        this.dataSourceArea = new MatTableDataSource([...this.areaSet]);
        console.log([...this.areaSet])
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

  getLine(row?: Area) {
    this.formInput.controls.AreaId.setValue(row.id);
    this.formInput.controls.AreaName.setValue(row.name);
    this.openRegister();
  }

  remove(row?: Responsibility) {
    this.filterRemoveResponsibility(row);
  }

  filterRemoveResponsibility(data: Responsibility) {
    this.dataSourceResposibility = new MatTableDataSource([...this.responsibilitySet]);

    this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != this.formInput.controls.AreaId.value));
    this.dataSourceAreaResposibility = new MatTableDataSource(this.dataSourceAreaResposibility.data.filter(option => option.id != data.id));

    if (this.dataSourceAreaResposibility.data.length > 0) {
      this.dataSourceAreaResposibility.data.forEach(element => {
        this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != element.id));
      });
    }
  }

  add(row?: Responsibility) {
    this.filterAddResponsibility(row);
  }
  
  filterAddResponsibility(data: Responsibility){}
  
  startSearchOptions() {
    this.filteredArea = this.areaFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterArea(value))
    );

    this.formInput.get("AreaId").valueChanges.subscribe(value => {
      this.filterAreaResponsibility(value);
    });

    this.formInput.get("AreaName").valueChanges.subscribe(value => {
      this.areaFilterCtrl.setValue(value)
    });

    // this.areaFilterCtrl.valueChanges.subscribe(value => {
    //   this.filteredArea = this.areaFilterCtrl.valueChanges.pipe(
    //     startWith(''),
    //     map(value => this.filterArea(value))
    //   );
    //   console.log(this.filteredArea)
    // });
  }

  startDatasources() {
    this.dataSourceResposibility = new MatTableDataSource([...this.responsibilitySet]);
    this.dataSourceAreaResposibility = new MatTableDataSource([...this.areaResponsibilitySet]);
  }

  filterArea(value: string = ''): Array<Area> {
    const filterValue = value.toLowerCase();
    return this.areaSet.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  filterAreaResponsibility(value: string = '0'){
    this.startDatasources();

    const filterValue = value.toString();

    if (this.dataSourceAreaResposibility.data.filter(option => option.areaId.toString().indexOf(filterValue) === 0).length > 0) {
      this.dataSourceAreaResposibility = new MatTableDataSource(this.dataSourceAreaResposibility.data.filter(option => option.areaId.toString().indexOf(filterValue) === 0));

    } else {
      this.dataSourceAreaResposibility = new MatTableDataSource<AreaResposibilities>();
    }

    // if (this.dataSourceResposibility.data.filter(option => option.id.toString().indexOf(filterValue) === 0).length > 0) {
    //   this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != Number(filterValue)));
    // }

    if (this.dataSourceAreaResposibility.data.length > 0) {
      this.dataSourceAreaResposibility.data.forEach(element => {
        this.dataSourceResposibility = new MatTableDataSource(this.dataSourceResposibility.data.filter(option => option.id != element.responsibilityId));
      });
    }
    this.startSearchOptions();
  }

  formDeclaration() {
    this.formInput = this.formBuilder.group({
        AreaId: [null, Validators.required]
      , AreaName: [null, Validators.required]
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
    this.dataSourceArea.filter = filterValue.trim().toLowerCase();
  }

  applyAreaResponsibilityFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAreaResposibility.filter = filterValue.trim().toLowerCase();
  }

  applyResponsibilityFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceResposibility.filter = filterValue.trim().toLowerCase();
  }
}
