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
  public statusShowAreaResposibilities: boolean = false;
  public statusShowResposibilityPermissions: boolean = false;

  public statusDataCollaboratorView: boolean = false;
  public statusDataDepartmentView: boolean = false;
  public statusDataAreaView: boolean = false;
  public statusDataResponsabilityView: boolean = false;
  public statusDataWeightView: boolean = false;
  public statusDataDecisionView: boolean = false;
  public statusDataAreaResposibilitiesView: boolean = false;
  public statusDataResposibilityPermissionsView: boolean = false;

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
      case 'Área & Cargos': { this.openAreaResposibilities(); break; }
      case 'Cargo & Permissões': { this.openResposibilityPermissions(); break; }
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
    this.closeResposibilityPermissions();
    this.closeAreaResposibilities();
  }
  closeCollaborator() { this.statusShowCollaborator = false; }

  openDepartment() {
    this.statusShowDepartment = true;
    this.closeCollaborator();
    this.closeArea();
    this.closeResponsability();
    this.closeWeight();
    this.closeResposibilityPermissions();
    this.closeAreaResposibilities();
  }
  closeDepartment() { this.statusShowDepartment = false; }

  openArea() {
    this.statusShowArea = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeResponsability();
    this.closeWeight();
    this.closeResposibilityPermissions();
    this.closeAreaResposibilities();
  }
  closeArea() { this.statusShowArea = false; }

  openResponsability() {
    this.statusShowResponsability = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeWeight();
    this.closeResposibilityPermissions();
    this.closeAreaResposibilities();
  }
  closeResponsability() { this.statusShowResponsability = false; }

  openWeight() {
    this.statusShowWeight = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeResponsability();
    this.closeResposibilityPermissions();
    this.closeAreaResposibilities();
  }
  closeWeight() { this.statusShowWeight = false; }

  openResposibilityPermissions() {
    this.statusShowResposibilityPermissions = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeWeight();
    this.closeResponsability();
    this.closeAreaResposibilities();
  }
  closeResposibilityPermissions() { this.statusShowResposibilityPermissions = false; }

  openAreaResposibilities() {
    this.statusShowAreaResposibilities = true;
    this.closeCollaborator();
    this.closeDepartment();
    this.closeArea();
    this.closeWeight();
    this.closeResponsability();
    this.closeResposibilityPermissions();
  }
  closeAreaResposibilities() { this.statusShowAreaResposibilities = false; }



  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element.id) {
          case '2': { 
                    this.statusDataDepartmentView = true;
                    this.statusDataAreaView = true;
                    this.statusDataResponsabilityView = true;
                    this.statusDataWeightView = true;
                    this.statusDataCollaboratorView = true;
                    this.statusDataAreaResposibilitiesView = true;
                    this.statusDataResposibilityPermissionsView  = true;
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
