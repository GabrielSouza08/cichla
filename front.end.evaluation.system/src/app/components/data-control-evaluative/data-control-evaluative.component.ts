import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-control-evaluative',
  templateUrl: './data-control-evaluative.component.html',
  styleUrls: ['./data-control-evaluative.component.css']
})
export class DataControlWeightComponent implements OnInit {

  public statusShowNote: boolean = false;
  public statusDataNoteView: boolean = false;

  public statusShowQuestion: boolean = false;
  public statusDataQuestionView: boolean = false;

  public statusShowCriterion: boolean = false;
  public statusDataCriterionView: boolean = false;

  public statusShowAreaCriterion: boolean = false;
  public statusDataAreaCriterionView: boolean = false;

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
      case 'Escalas': { this.openNote(); break; }
      case 'Critérios': { this.openCriterion(); break; }
      case 'Área & Critério': { this.openAreaCriterion(); break; }
      case 'Questões': { this.openQuestion(); break; }
    }

    this.checkOptionsDecision();
    this.nameDataDecision = name;
  }

  openNote() {
    this.statusShowNote = true;
    this.closeQuestion();
    this.closeCriterion();
    this.closeAreaCriterion();
  }
  closeNote() { this.statusShowNote = false; }

  openQuestion() {
    this.statusShowQuestion = true;
    this.closeNote();
    this.closeCriterion();
    this.closeAreaCriterion();
  }
  closeQuestion() { this.statusShowQuestion = false; }

  openCriterion() {
    this.statusShowCriterion = true;
    this.closeNote();
    this.closeQuestion();
    this.closeAreaCriterion();
  }
  closeCriterion() { this.statusShowCriterion = false; }

  openAreaCriterion() {
    this.statusShowAreaCriterion = true;
    this.closeNote();
    this.closeQuestion();
    this.closeCriterion();
  }
  closeAreaCriterion() { this.statusShowAreaCriterion = false; }



  validationPermission() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    if (this.userInfo != null) {
      this.userInfo.permissions.forEach(element => {
        switch (element.id) {
          case '2': { 
                    this.statusDataNoteView = true;  
                    this.statusDataQuestionView = true; 
                    this.statusDataCriterionView = true; 
                    this.statusDataAreaCriterionView = true; 
                    break; 
          }default: {
            break;
          }
        };
      });
    }
  }
}
  