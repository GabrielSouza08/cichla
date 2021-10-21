import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  public statusDashboard = null;
  public statusColaborator = null;
  public statusDptos = null;
  public statusEvaluation = null;

  showNameUser = true;

  userInfo;
  colaboratorList;

  constructor(private router: Router) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (this.userInfo.UserPermission == 1) {
      this.statusDashboard = true;
    } else {
      this.statusEvaluation = true;
    }

  }

  exit() {
    localStorage.clear();
    this.router.navigateByUrl('/loginPage');
  }

  showName() {
    if (this.showNameUser == true) {
      this.showNameUser = false;
    } else {
      this.showNameUser = true;
    }
  }

  dashboardOpen() {
    this.statusDashboard = true;
    this.colaboratorClose();
    this.dptoClose();
    this.evaluationClose();
  }
  dashboardClose() {
    this.statusDashboard = null;
  }

  colaboratorOpen() {
    this.statusColaborator = true;
    this.dashboardClose();
    this.dptoClose();
    this.evaluationClose();
  }
  colaboratorClose() {
    this.statusColaborator = null;
  }

  dptoOpen() {
    this.statusDptos = true;
    this.dashboardClose();
    this.colaboratorClose();
    this.evaluationClose();
  }
  dptoClose() {
    this.statusDptos = null;
  }

  evaluationOpen() {
    this.statusEvaluation = true;
    this.dashboardClose();
    this.colaboratorClose();
    this.dptoClose();
  }
  evaluationClose() {
    this.statusEvaluation = false;
  }

}
