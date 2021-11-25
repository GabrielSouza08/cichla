import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public statusDashboard: boolean = true;
  public statusDashboardOpen: boolean = false;
  public statusEvaluation: boolean = true;
  public statusEvaluationCollaboratorOpen: boolean = false;
  public statusEvaluationDepartmentOpen: boolean = false;
  public statusCRUD: boolean = true;
  public statusHomeOpen: boolean = true;
  public statusCRUDColaboratorOpen: boolean = false;
  public statusCRUDWeightOpen: boolean = false;
  public statusPersonalReport: boolean = false;
  public statusPersonalReportOpen: boolean = false;
  public showNameUser: boolean = true;
  public viewHeader: boolean = true;

  public userInfo: any;

  constructor(private router: Router) { }

  ngOnInit() {
    this.validationPermission();
    this.primaryScreen();
  }

  exit() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  checkControlView() {
    this.showNameUser = !this.showNameUser;
    this.viewHeader = !this.viewHeader;
  }

  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element.id) {
          case 3: { this.statusPersonalReport = true; break;}
          case 6: { this.statusEvaluation = true; break;}
          case 2: { this.statusCRUD = true; break;}
          case 1: { this.statusDashboard = true; break;}
          default: {
            break;
          }
        };
      });
    }
  }
  
  primaryScreen(){
    // if(this.statusDashboard == true || this.statusPersonalReport == true){ this.homeClose();}

    // if(this.statusDashboard == true){ this.PersonalReportClose();}
  }
  
  homeClose() {
    this.statusHomeOpen = false;
  }

  dashboardOpen() {
    this.statusDashboardOpen = true;
    this.evaluationColaboratorClose();
    this.evaluationDepartmentClose();
    this.CRUDColaboratorClose();
    this.CRUDWeightClose();
    this.PersonalReportClose();

  }
  dashboardClose() {
    this.statusDashboardOpen = false;
  }

  evaluatioColaboratornOpen() {
    this.statusEvaluationCollaboratorOpen = true;
    this.dashboardClose();
    this.evaluationDepartmentClose();
    this.CRUDColaboratorClose();
    this.CRUDWeightClose();
    this.PersonalReportClose();
    this.homeClose();
  }
  evaluationColaboratorClose() {
    this.statusEvaluationCollaboratorOpen = false;
  }

  evaluationDepartmentOpen() {
    this.statusEvaluationDepartmentOpen = true;
    this.dashboardClose();
    this.evaluationColaboratorClose()
    this.CRUDColaboratorClose();
    this.CRUDWeightClose();
    this.PersonalReportClose();
    this.homeClose();
  }
  evaluationDepartmentClose() {
    this.statusEvaluationDepartmentOpen = false;
  }

  CRUDColaboratorOpen() {
    this.statusCRUDColaboratorOpen = true;
    this.dashboardClose();
    this.CRUDWeightClose();
    this.evaluationColaboratorClose();
    this.evaluationDepartmentClose();
    this.PersonalReportClose();
    this.homeClose();
  }
  CRUDColaboratorClose() {
    this.statusCRUDColaboratorOpen = false;
  }

  CRUDWeightOpen() {
    this.statusCRUDWeightOpen = true;
    this.dashboardClose();
    this.CRUDColaboratorClose()
    this.evaluationColaboratorClose();
    this.evaluationDepartmentClose();
    this.PersonalReportClose();
    this.homeClose();
  }
  CRUDWeightClose() {
    this.statusCRUDWeightOpen = false;
  }

  PersonalReportOpen() {
    this.statusPersonalReportOpen = true;
    this.dashboardClose();
    this.evaluationColaboratorClose();
    this.evaluationDepartmentClose();
    this.CRUDColaboratorClose();
    this.homeClose();
  }
  PersonalReportClose() {
    this.statusPersonalReportOpen = false;
  }
}
