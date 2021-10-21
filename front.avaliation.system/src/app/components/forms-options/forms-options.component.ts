import { Component, OnInit } from '@angular/core';
import { ColaboratorService } from 'src/app/services/colaborator.service';

@Component({
  selector: 'app-forms-options',
  templateUrl: './forms-options.component.html',
  styleUrls: ['./forms-options.component.css']
})
export class FormsOptionsComponent implements OnInit {

  public showDpto = null;
  public showColaborator = null;
  userInfo;
  clientList;
  loading = true;
  colaboratorInfo = null;

  constructor(private colaboratorService: ColaboratorService) { }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    // this.colaboratorService.getColaborators(this.userInfo.UserId).subscribe(res => {
    //   this.clientList = res;
    //   this.loading = null;
    // });

  }

  dptoAvaliator() {
    this.showDpto = true;
  }

  colaboratorAvaliator(colaboratorId) {
    this.colaboratorService.getColaboratorDetais(colaboratorId).subscribe(res => {
      this.colaboratorInfo = res;
      localStorage.setItem("colaboratorInfo", JSON.stringify(this.colaboratorInfo));
      if (this.colaboratorInfo != null) {
        this.showColaborator = true;
      }

    });

  }

  showOptions() {
    this.showDpto = null;
    this.showColaborator = null;
  }
}
