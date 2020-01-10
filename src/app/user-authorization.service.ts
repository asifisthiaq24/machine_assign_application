import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAuthorizationService {
  userAuthStatus:Boolean = false;
  constructor(private http:HttpClient) { }

  userAuthorization():any{
    let accessToken = localStorage.getItem('accessToken')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'authorization': 'Asif '+accessToken
      })
    };
    let resp_get_act = this.http.get('http://localhost:3001/login/',httpOptions)
    resp_get_act.subscribe((data)=>{
      // this.auth_bol=true;
      return true;
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
          //this.auth_bol=true;
          return true;
        },(err)=>{
          console.log(err.statusText)
          //this.router.navigate(['/login']);
          return false;
        })
      },(err)=>{
        console.log(err.statusText)
        return false;
      })
    })
  }
}
