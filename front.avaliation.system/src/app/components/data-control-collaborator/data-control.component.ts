import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-control',
  templateUrl: './data-control.component.html',
  styleUrls: ['./data-control.component.css']
})
export class DataControlComponent implements OnInit {

  public statusShowCollaborator: boolean = false;
  public statusShowDepartment: boolean = false;
  public statusShowArea: boolean = false;
  public statusShowLocal: boolean = false;
  public statusShowWeight: boolean = false;
  public statusShowResponsability: boolean = false;

  public statusDataCollaboratorView: boolean = false;
  public statusDataLocalView: boolean = false;
  public statusDataDepartmentView: boolean = false;
  public statusDataAreaView: boolean = false;
  public statusDataResponsabilityView: boolean = false;
  public statusDataWeightView: boolean = false;
  public statusDataDecisionView: boolean = false;

  public nameDataDecision: string = 'Selecione o dado';
  public userInfo: any;

  constructor() { }

  ngOnInit() {
    this.validationPermission();
  }

  checkOptionsDecision() {
    this.statusDataDecisionView = !this.statusDataDecisionView;
  }


  getselection(name: string) {
    switch (name) {
      case 'Colaborador': { this.openCollaborator(); break; }
      case 'Local': { this.openLocal(); break; }
      case 'Departamento': { this.openDepartment(); break; }
      case 'Área': { this.openArea(); break; }
      case 'Cargo': { this.openResponsability(); break; }
      case 'Peso': { this.openWeight(); break; }
    }

    this.checkOptionsDecision();
    this.nameDataDecision = name;
  }


  openCollaborator() {
    this.statusShowCollaborator = true;
    this.closeDepartment();
    this.closeArea();
    this.closeResponsability();
    this.closeWeight();
    this.closeLocal();
  }
  closeCollaborator() { this.statusShowCollaborator = false; }

  openDepartment() {
    this.statusShowDepartment = true;
    this.closeCollaborator();
    this.closeArea();
    this.closeResponsability();
    this.closeWeight();
    this.closeLocal();
  }
  closeDepartment() { this.statusShowDepartment = false; }

  openArea() {
    this.statusShowArea = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeResponsability();
    this.closeWeight();
    this.closeLocal();
  }
  closeArea() { this.statusShowArea = false; }

  openResponsability() {
    this.statusShowResponsability = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeWeight();
    this.closeLocal();
  }
  closeResponsability() { this.statusShowResponsability = false; }

  openWeight() {
    this.statusShowWeight = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeResponsability();
    this.closeLocal();
  }
  closeWeight() { this.statusShowWeight = false; }

  openLocal() {
    this.statusShowLocal = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeResponsability();
    this.closeWeight();
  }
  closeLocal() { this.statusShowLocal = false; }

  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element) {
          case 1005:  { this.statusDataLocalView = true; break; }
          case 1006: { this.statusDataDepartmentView = true; break; }
          case 1007: { this.statusDataAreaView = true; break; }
          case 1008: { this.statusDataResponsabilityView = true; break; }
          case 1009: { this.statusDataWeightView = true;break; }
          case 1010: { this.statusDataCollaboratorView = true; break; }
          default: {
            break;
          }
        };
      });
    }
  }
}
