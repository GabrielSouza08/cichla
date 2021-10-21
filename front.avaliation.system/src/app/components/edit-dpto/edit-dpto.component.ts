import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-dpto',
  templateUrl: './edit-dpto.component.html',
  styleUrls: ['./edit-dpto.component.css']
})
export class EditDptoComponent implements OnInit {

  public editDptop = null;

  constructor() { }

  ngOnInit() {
  }

  getDpto(nameDpto) {
    if (nameDpto != "") {
      this.editDptop = null;
    }
  }

  showEditDpto() {
    this.editDptop = true;
  }
  closeEditDpto() {
    this.editDptop = null;
  }

}
