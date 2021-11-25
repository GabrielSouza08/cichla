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

  public statusDataCollaboratorView: boolean = true;
  public statusDataLocalView: boolean = false;
  public statusDataDepartmentView: boolean = true;
  public statusDataAreaView: boolean = true;
  public statusDataResponsabilityView: boolean = true;
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
  }
  closeCollaborator() { this.statusShowCollaborator = false; }

  openDepartment() {
    this.statusShowDepartment = true;
    this.closeCollaborator();
    this.closeArea();
    this.closeResponsability();
    this.closeWeight();
  }
  closeDepartment() { this.statusShowDepartment = false; }

  openArea() {
    this.statusShowArea = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeResponsability();
    this.closeWeight();
  }
  closeArea() { this.statusShowArea = false; }

  openResponsability() {
    this.statusShowResponsability = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeWeight();
  }
  closeResponsability() { this.statusShowResponsability = false; }

  openWeight() {
    this.statusShowWeight = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeResponsability();
  }
  closeWeight() { this.statusShowWeight = false; }

  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element) {
          case 2: { 
                    this.statusDataDepartmentView = true;
                    this.statusDataAreaView = true;
                    this.statusDataResponsabilityView = true;
                    this.statusDataWeightView = true;
                    this.statusDataCollaboratorView = true;
                    break; 
                  }
          default: {
            break;
          }
        };
      });
    }
  }
}
