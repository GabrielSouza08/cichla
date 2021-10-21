import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public credentialsForm: FormGroup;

  public loading: boolean = false;
  public userInfo: any;
  
  public statusMessage:boolean = false; 
  public messages: Array<string> = [] 

  public statusShowPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    sessionStorage.clear();
    
    this.credentialsForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  showPassword(){ this.statusShowPassword = !this.statusShowPassword; }

  login() {
    this.loading = true;

    this.loginService.postLogin(this.credentialsForm.value.username, this.credentialsForm.value.password).subscribe(res => {

      this.loading = false;
      this.userInfo = res.data;

      sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));

      this.router.navigateByUrl('/');

      // if (res.success) {
      //   this.loading = false;
      //   this.userInfo = res.data;
  
      //   sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo));

      //   this.router.navigateByUrl('/');
      // }
      // else {
               
      //   this.loading = false;
      //   this.statusMessage = true;

      //   res.data.forEach(data => { this.messages.push(data.message);});

      //   setTimeout(() => { 
      //     this.statusMessage = false;
      //     this.messages = Array<string>();
      //   }, 10000);
      // }
    });
  }
}
