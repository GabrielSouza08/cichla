import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-control-weight',
  templateUrl: './data-control-weight.component.html',
  styleUrls: ['./data-control-weight.component.css']
})
export class DataControlWeightComponent implements OnInit {

  public statusShowNote: boolean = false;
  public statusDataNoteView: boolean = false;

  public statusShowQuestionDepartment: boolean = false;
  public statusDataQuestionDepartmentView: boolean = false;

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
      case 'Notas': { this.openNote(); break; }
      case 'Dapartamento & Questões': { this.openQuestionDepartment(); break; }
    }

    this.checkOptionsDecision();
    this.nameDataDecision = name;
  }


  openNote() {
    this.statusShowNote = true;
    this.closeQuestionDepartment();
  }
  closeNote() { this.statusShowNote = false; }

  openQuestionDepartment() {
    this.statusShowQuestionDepartment = true;
    this.closeNote();
  }
  closeQuestionDepartment() { this.statusShowQuestionDepartment = false; }



  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element.id) {
          case '2': { 
                    this.statusDataNoteView = true;  
                    this.statusDataQuestionDepartmentView = true; 
                    break; 
          }default: {
            break;
          }
        };
      });
    }
  }
}
  