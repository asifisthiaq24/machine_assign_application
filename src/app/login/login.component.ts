import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalVariablesService } from '../global-variables.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [GlobalVariablesService]
})
export class LoginComponent implements OnInit {

  loginMessage:String = '';
  username:String='';
  password:String='';
  _users:User[];
  __users:any;
  loginMessageBol:Boolean=false;
  welcomeMsg:any='';
  message:string;

  // constructor(private userservice:UserService) { }
  constructor(private http:HttpClient,private router: Router,private _gvs:GlobalVariablesService) { }
  ngOnInit() { 
    //this.getUsers();
    this._gvs.currentMessage.subscribe(message => this.message = message)

  }
  // getUsers(){
  //   this.userservice.getUsersFromServer().subscribe(users=>this._users=users)
  // }
  logIn(){
    // fetch('http://localhost:3001/login/')
    // .then(result =>{
    //   return result.json()
    //   })   
    //   .then( data =>{
    //     console.log(data)
    //   })
    // let resp = this.http.get('http://localhost:3001/login/')
    // resp.subscribe((data)=>{
    //   console.log(data)
    //   this.__users = data;
    // })
    let resp_post = this.http.post('http://localhost:3001/login/',{"username":this.username,"password":this.password})
    resp_post.subscribe((data)=>{
      this.loginMessage = data.message;
      if(this.loginMessage == 'Login successful.'){
        localStorage.setItem('accessToken',data.accessToken);
        localStorage.setItem('refreshToken',data.refreshToken);
        localStorage.setItem('uid',data.id);
        this._gvs.changeMessage('Welcome, '+this.username)
        this.router.navigate(['/home']);
      }
      else{
        this.loginMessageBol=true;
      }
      console.log(data)
    })
  }




}
