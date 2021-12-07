  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
  import { AreaService } from 'src/app/services/area.service';
  import { CriterionService } from 'src/app/services/criterion.service';
  import { MatTableDataSource } from '@angular/material/table';
  import { Observable } from "rxjs";
  import { map, startWith } from "rxjs/operators";
  
  export interface AreaCriterion {
    id: string;
    criterionId: string;
    criterionName: string;
    weight: number;
    areaName: string;
    areaId: string;
    registerDate: string;
    isChange: boolean;
  }
  
  export interface Area {
    id: string;
    name: string;
  }
  
  export interface Criterion {
    id: string;
    name: string;
  }
  
  export interface ElementsFinal {
    AreaId: string;
    CriterionId: string;
    Weight: number;
    Status: string;
  }
  
  @Component({
    selector: 'app-relationship-area-criterion',
    templateUrl: './relationship-area-criterion.component.html',
    styleUrls: ['./relationship-area-criterion.component.css']
  })
  export class RelationshipAreaCriterionComponent implements OnInit {
  
    public filteredArea: Observable<Array<Area>>;
    public filteredCriterion: Observable<Array<Criterion>>;
  
    public criterionFilterCtrl: FormControl = new FormControl();
    public areaFilterCtrl: FormControl = new FormControl();
  
    public statusShowTable: boolean = false;
    public statusShowInput: boolean = false;
    public statusLoading: boolean = false;
    public statusMessage: boolean = false;
    public statusSuccess: boolean = false;
    public statusConfirmAction: boolean = false;
    public statusConfirmActionWeight: boolean = false;
  
    public dataSourceArea = new MatTableDataSource<Area>();
    public dataSourceAreaCriterion = new MatTableDataSource<AreaCriterion>();
    public dataSourceCriterion = new MatTableDataSource<Criterion>();
  
    public displayedColumnsArea: string[] = ["name"];
    public displayedColumnsAreaCriterion: string[] = ["criterionName", "weight", "update", "remove"];
    public displayedColumnsCriterion: string[] = ["name", "input"]; 
  
    public rowsArea: Array<Area> = [{ id: '0', name: 'Não encontrado'}];
    public rowsAreaCriterion: Array<AreaCriterion> = [];
    public rowsCriterionDefined: Array<Criterion> = [];
  
    public criterionSet: Array<Criterion> = [{ id: '0', name: 'Indeterminado'}];
    public criterionBackupSet: Array<Criterion> = [{ id: '0', name: 'Indeterminado'}];
    public areaSet: Array<Area> = [];
    public areaCriterionSet: Array<AreaCriterion> = [];
    public areaCriterionBackupSet: Array<AreaCriterion> = [];
    public relationshipCompletion: Array<ElementsFinal> = [];
  
    public messages: Array<string> = []
    public messageSuccess: string;
    public messageAction: string;
  
    public formInput: FormGroup;
  
    public dataUser: any;

    public dataCriterionInclude: Criterion;
    public dataCriterionChange: AreaCriterion;
  
    //Controle de ações(Sim ou não)
    public accessAction: boolean;
    public valueWeight: number = 1;
    public accessActionRemove: boolean;
    public accessCloseChange: boolean;
    public accessIncludeWeight: boolean;
    public accessChangeWeight: boolean;
    public idRemove: number;
  
    constructor(private formBuilder: FormBuilder, private areaService: AreaService, private criterionService: CriterionService) { }
  
  
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
      let row: AreaCriterion;
      let list: Array<AreaCriterion> = [];
  
      this.criterionService.GetRelationshipCriterionArea().subscribe(res => {
        if (res.success == true) {
          res.data.forEach(function (element) {
            row = {
              id: element.id,
              areaId: element.areaId,
              areaName: element.areaName,
              weight: element.weight,
              registerDate: element.registerDate,
              criterionId: element.criterionId,
              criterionName: element.criterionName,
              isChange: false
            };
            if (row) { list.push(row); }
          });
          this.areaCriterionSet = list;
          this.dataSourceAreaCriterion = new MatTableDataSource([...this.areaCriterionSet]);
        }
      });
    }
  
    getArea() {
      let row: Criterion;
      let list: Array<Criterion> = [];
  
      this.areaService.Get().subscribe(res => {
        if (res.success == true) {
          res.data.forEach(function (element) {
            row = {
              id: element.id,
              name: element.name
            };
            if (row) { list.push(row); }
          });
          this.areaSet = [...list];
          this.dataSourceArea = new MatTableDataSource([...this.areaSet]);
        }
      });
    }
  
    getResponsibilibity() {
      let row: Criterion;
      let list: Array<Criterion> = [];
  
      this.criterionService.Get().subscribe(res => {
        if (res.success == true) {
          res.data.forEach(function (element) {
            row = {
              id: element.id,
              name: element.name
            };
            if (row) { list.push(row); }
          });
          this.criterionSet = list;
          this.dataSourceCriterion = new MatTableDataSource([...this.criterionSet]);
        }
      });
    }
  
    getLine(row?: Area) {
      this.formInput.controls.AreaId.setValue(row.id);
      this.formInput.controls.AreaName.setValue(row.name);
      this.openRegister();
    }
  
    remove(row?: AreaCriterion) {
      this.filterRemoveCriterion(row);
    }
  
    filterRemoveCriterion(data: AreaCriterion) {
      this.dataSourceCriterion = new MatTableDataSource([...this.criterionSet]);
  
      this.dataSourceAreaCriterion = new MatTableDataSource(this.dataSourceAreaCriterion.data.filter(option => option.criterionId != data.criterionId));
  
      if (this.dataSourceAreaCriterion.data.length > 0) {
        this.dataSourceAreaCriterion.data.forEach(element => {
          this.dataSourceCriterion = new MatTableDataSource(this.dataSourceCriterion.data.filter(option => option.id != element.criterionId));
        });
      }
      this.dataSourceCriterion._updateChangeSubscription();
      this.dataSourceAreaCriterion._updateChangeSubscription();
    }
  
    add(row?: Criterion) {
      this.dataCriterionInclude = row;

      this.accessIncludeWeight = true;
      this.messageAction = `Qual é o Peso para o critério: ${row.name}?`;
      
      this.openConfirmActionWeight();
    }
    
    filterAddCriterion(data: Criterion){
      let areaId: string = this.formInput.controls.AreaId.value;
      let areaName: string = this.formInput.controls.AreaName.value;
  
      let object: AreaCriterion = { id:'', criterionId: data.id, criterionName: data.name, areaId: areaId, areaName: areaName, weight: this.valueWeight, registerDate: '', isChange: false};
      this.dataSourceAreaCriterion.data.push(object);
  
      this.dataSourceAreaCriterion.data.forEach(element => {
        this.dataSourceCriterion = new MatTableDataSource(this.dataSourceCriterion.data.filter(option => option.id != element.criterionId));
      });
  
      this.dataSourceAreaCriterion._updateChangeSubscription()
      this.dataSourceCriterion._updateChangeSubscription()
    }

    change(row?: AreaCriterion){
      this.dataCriterionChange = row;

      this.accessChangeWeight = true;
      this.messageAction = `Qual é o Peso para critério: ${row.criterionName}?`;
      
      this.openConfirmActionWeight();
    }

    filterChangeCriterion(data: AreaCriterion){

      this.dataSourceAreaCriterion.data = this.dataSourceAreaCriterion.data.filter(options => options.criterionId != data.criterionId)

      let status = (this.areaCriterionSet.filter(option => option.criterionId == data.criterionId).length > 0)
      let object: AreaCriterion = { id:'', criterionId: data.criterionId, criterionName: data.criterionName, areaId: data.areaId, areaName: data.areaName, weight: this.valueWeight, registerDate: '', isChange: status };
      this.dataSourceAreaCriterion.data.push(object);
  
      this.dataSourceAreaCriterion._updateChangeSubscription()
      this.dataSourceCriterion._updateChangeSubscription()
    }
  
    inputRegister() {
      this.analyzeDataRequest();
      
      if (this.relationshipCompletion.length == 0) { this.showMessageError('Para salvar altere algum dado!'); }
      else {
  
        this.criterionService.InputAreaCriterion(this.relationshipCompletion).subscribe(res => {
          if (res.success == true) {
  
            this.showMessageSucceess('Alteração concluída!');
            setTimeout(() => { this.openTable(); }, 1500);
            
          } else { this.openTable(); res.msg.forEach(message => { this.showMessageError(message.text); }); }
        });
      }
  
      this.relationshipCompletion = new Array<ElementsFinal>();
    }
  
    analyzeDataRequest(){
      let remove: Array<AreaCriterion> = [];
      let include: Array<AreaCriterion> = [];
      let change: Array<AreaCriterion> = [];
      
      this.dataSourceAreaCriterion.data.forEach(element => {
        if(this.areaCriterionSet.filter( option => option.criterionId == element.criterionId && 
        option.areaId == element.areaId).length == 0 || 
        this.areaCriterionSet.filter(option => option.areaId == element.areaId).length == 0){
          include.push(element);
        }
      });

      this.dataSourceAreaCriterion.data.forEach(element => {
        if(element.isChange){
          change.push(element);
        }
      });
  
      this.areaCriterionSet.forEach(element => {
        if(this.dataSourceAreaCriterion.data.filter(option => option.criterionId == element.criterionId).length == 0 && 
        this.dataSourceAreaCriterion.data.filter(option => option.areaId == element.areaId ).length > 0 ||
        this.dataSourceAreaCriterion.data.length == 0 &&
        this.areaCriterionSet.filter(option => option.areaId == this.formInput.controls.AreaId.value).length > 0 &&
        element.areaId == this.formInput.controls.AreaId.value){
          remove.push(element);
        }
      });
        
      if (remove.length > 0) {
        remove.forEach(element => {
          this.relationshipCompletion.push({ AreaId: element.areaId, CriterionId: element.criterionId, Weight: element.weight, Status: 'Remove' });
        });
      }
  
      if (change.length > 0) {
        change.forEach(element => {
          this.relationshipCompletion.push({ AreaId: element.areaId, CriterionId: element.criterionId, Weight: element.weight, Status: 'Change' });
        });
      }
  
      if (include.length > 0) {
        include.forEach(element => {
          this.relationshipCompletion.push({ AreaId: element.areaId, CriterionId: element.criterionId, Weight: element.weight, Status: 'Include' });
        });
      }
  
    }
    
    startSearchOptions() {
      this.filteredArea = this.areaFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterArea(value))
      );
  
      this.formInput.get("AreaId").valueChanges.subscribe(value => {
        this.filterAreaCriterion(value);
      });
  
      this.formInput.get("AreaName").valueChanges.subscribe(value => {
        this.areaFilterCtrl.setValue(value)
      });
    }
  
    startDatasources() {
      this.dataSourceCriterion = new MatTableDataSource([...this.criterionSet]);
      this.dataSourceAreaCriterion = new MatTableDataSource([...this.areaCriterionSet]);
    }
  
    filterArea(value: string = ''): Array<Area> {
      const filterValue = value.toLowerCase();
      return this.areaSet.filter(
        option => option.name.toLowerCase().indexOf(filterValue) === 0
      );
    }
  
    filterAreaCriterion(value: string = '0'){
      this.startDatasources();
  
      let name = this.areaSet.filter(option => option.id.toString().indexOf(value) === 0)[0].name
      this.formInput.controls.AreaName.setValue(name);
  
      const filterValue = value.toString();
      
      if(this.dataSourceAreaCriterion.data.length > 0) {
        if (this.dataSourceAreaCriterion.data.filter(option => option.areaId.toString().indexOf(filterValue) === 0).length > 0) {
          this.dataSourceAreaCriterion = new MatTableDataSource(this.dataSourceAreaCriterion.data.filter(option => option.areaId.toString().indexOf(filterValue) === 0));
  
        } else {
          this.dataSourceAreaCriterion = new MatTableDataSource<AreaCriterion>();
        }
      }
  
      if (this.dataSourceAreaCriterion.data.length > 0) {
        this.dataSourceAreaCriterion.data.forEach(element => {
          this.dataSourceCriterion = new MatTableDataSource(this.dataSourceCriterion.data.filter(option => option.id != element.criterionId));
        });
      }
    }
  
    formDeclaration() {
      this.formInput = this.formBuilder.group({
          AreaId: [null, Validators.required]
        , AreaName: [null, Validators.required]
      });
    }
  
    getValueAction(value: boolean = false) {
      this.accessAction = value;
  
      switch (true) {
        case this.accessCloseChange: {
          this.ActionCloseChange();
          break;
        }
        case this.accessIncludeWeight: {
          this.ActionIncludeWeight();
          break;
        }
        case this.accessChangeWeight: {
          this.ActionChangeWeight();
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
  
    ActionIncludeWeight(){
      this.closeConfirmActionWeight();

      this.filterAddCriterion(this.dataCriterionInclude);

      this.dataCriterionInclude = undefined;
      this.valueWeight = 1;
      this.accessIncludeWeight = false;
    }

    ActionChangeWeight(){
      this.closeConfirmActionWeight();

      this.filterChangeCriterion(this.dataCriterionChange);

      this.dataCriterionInclude = undefined;
      this.valueWeight = 1;
      this.accessChangeWeight = false;
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

    openConfirmActionWeight() { this.statusConfirmActionWeight = true; }
    closeConfirmActionWeight() { this.statusConfirmActionWeight = false; }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceArea.filter = filterValue.trim().toLowerCase();
    }
  
    applyAreaCriterionFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceAreaCriterion.filter = filterValue.trim().toLowerCase();
    }
  
    applyCriterionFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceCriterion.filter = filterValue.trim().toLowerCase();
    }
  }
  