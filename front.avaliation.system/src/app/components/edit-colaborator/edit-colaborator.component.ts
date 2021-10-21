import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-colaborator',
  templateUrl: './edit-colaborator.component.html',
  styleUrls: ['./edit-colaborator.component.css']
})
export class EditColaboratorComponent implements OnInit {

  public editColaborator = null;

  constructor() { }

  ngOnInit() {
  }

  getColaborator(nameColaborator) {
    if (nameColaborator != "") {
      this.editColaborator = null;
    }
  }

  showEditColaborator() {
    this.editColaborator = true;
  }
  closeEditColaborator() {
    this.editColaborator = null;
  }

}
