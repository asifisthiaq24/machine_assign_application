import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { access } from 'fs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private http:HttpClient,private router: Router) { }
  auth_bol:Boolean=false;
  ngOnInit() {
    this.authenticateUser();
  }
  authenticateUser(){
    let accessToken = localStorage.getItem('accessToken')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': 'Asif '+accessToken
      })
    };
    let resp_get_act = this.http.get('http://localhost:3001/login/',httpOptions)
    resp_get_act.subscribe((data)=>{
      this.auth_bol=true;
    },(err)=>{
      console.log(err.statusText)
      const refreshToken = localStorage.getItem('refreshToken')
      let resp_post_rft = this.http.post('http://localhost:3001/login/token',{token:refreshToken})
      resp_post_rft.subscribe((data)=>{
        console.log(data)
        accessToken = data.accessToken;
        console.log(accessToken)
        localStorage.setItem('accessToken',accessToken);
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'authorization': 'Asif '+accessToken
          })
        };
        let resp_get_act2 = this.http.get('http://localhost:3001/login/',httpOptions)
        resp_get_act2.subscribe((data)=>{
          this.auth_bol=true;
        },(err)=>{
          console.log(err.statusText)
          this.router.navigate(['/login']);
        })
      },(err)=>{
        console.log(err.statusText)
      })
    })
  }
  logOut(){
    localStorage.setItem('accessToken','');
    localStorage.setItem('refreshToken','');
    this.router.navigate(['/login']);
  }
}
