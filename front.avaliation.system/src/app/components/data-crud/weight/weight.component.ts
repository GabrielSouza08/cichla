import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WeightService } from 'src/app/services/weight.service';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})
export class WeightComponent implements OnInit {
  
  public statusShowTable: boolean = false;
  public statusShowChange: boolean = false;
  public statusShowInput: boolean = false;
  public statusShowImport: boolean = false;
  public statusLoading: boolean = false;
  public statusMessage: boolean = false;


  public header: Array<any>;
  public rows: Array<any>;
  public messages: Array<string> = []

  public formInput: FormGroup;
  public formChange: FormGroup;
  public formImport: FormGroup;

  public file: Set<File>;
  public progress: number = 0;

  constructor(private formBuilder: FormBuilder, private weightService: WeightService) { }

  ngOnInit() {
    this.getListWeight();
    this.headerControl();
    this.formDeclaration();
  }

  getListWeight() {
    this.openTable();
  }

  change(id: number, weight: string, dateRegister: string) {
    console.log(id, weight, dateRegister)

    this.formChange.controls.ID.setValue(id);
    this.formChange.controls.Weight.setValue(weight);
    this.formChange.controls.DateRegister.setValue(dateRegister);

    this.openChange();
  }

  getFile(event) {
    if (event != '' || event != null) {
      const selectedFiles = <FileList>event.srcElement.files;
      const fileNames = [];
      this.file = new Set();
      for (let i = 0; i < selectedFiles.length; i++) {
        fileNames.push(selectedFiles[i].name);
        this.file.add(selectedFiles[i]);
      }
      this.progress = 0;
    }
  }

  inputChange() {
    this.statusLoading = true;
    console.log('dados de submição de modificação', this.formChange.controls.Weight.value)

    this.statusMessage = true;

    //  res.data.forEach(data => { this.messages.push(data.message);});
    this.messages.push('teste');

    setTimeout(() => {
      this.statusMessage = false;
      this.messages = Array<string>();
    }, 10000);

    setTimeout(() => {

      this.openTable();
      this.statusLoading = false;
    }, 10000);
  }

  inputRegister() {
    this.statusLoading = true;

    console.log('dados de submição de cadastro', this.formInput.controls.Weight.value)

    this.statusMessage = true;

    //  res.data.forEach(data => { this.messages.push(data.message);});
    this.messages.push('teste');
  
    setTimeout(() => {
      this.statusMessage = false;
      this.messages = Array<string>();
    }, 10000);

    setTimeout(() => {

      this.openTable();
      this.statusLoading = false;
    }, 10000);
  }

  inputImport() {
    this.statusLoading = true;
    this.formImport.controls.File.setValue(this.file)

    console.log('dados de submição de importação', this.formImport.controls.File.value);

    this.statusMessage = true;

    //  res.data.forEach(data => { this.messages.push(data.message);});

    this.messages.push('teste');

    setTimeout(() => {
      this.statusMessage = false;
      this.messages = Array<string>();
    }, 10000);

    setTimeout(() => {

      this.openTable();
      this.statusLoading = false;
    }, 10000);
  }

  delete(id: number) {
    console.log(id)
  }

  openTable() {
    this.statusShowTable = true;
    this.closeChange();
    this.closeRegister();
    this.closeImport();
  }
  closeTable() { this.statusShowTable = false; }

  openChange() {
    this.statusShowChange = true;
    this.closeTable();
    this.closeRegister();
    this.closeImport();
    this.formDeclaration();
  }
  closeChange() { this.statusShowChange = false; }

  openRegister() {
    this.statusShowInput = true;
    this.closeTable();
    this.closeChange();
    this.closeImport();
    this.formDeclaration();
  }
  closeRegister() { this.statusShowInput = false; }

  openImport() {
    this.statusShowImport = true;
    this.closeTable();
    this.closeChange();
    this.closeRegister();
  }
  closeImport() { this.statusShowImport = false; }

  headerControl() {
    this.header = ["Peso", "Data de cadastro", "Data de modificação"];

    this.rows = [
      {
        "Id": 0
        , "Peso": "TI"
        , "Data de cadastro": "29/08/2020"
        , "Data de modificação": "29/08/2020"
        , "StatusCode": 0,
      }
    ];
  }

  formDeclaration() {
    this.formChange = this.formBuilder.group({
      ID: [null, Validators.required]
      , Weight: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });


    this.formInput = this.formBuilder.group({
      ID: [null, Validators.required]
      , Weight: [null, Validators.required]
      , DateRegister: [null, Validators.required]
    });

    this.formImport = this.formBuilder.group({
      File: [null, Validators.required]
      ,TypeImport: [null, Validators.required]
    });
  }

  checkLoading() {
    this.statusLoading = !this.statusLoading;
  }
}
