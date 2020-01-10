import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  loggedUser:any = 'Welcome'
  private messageSource = new BehaviorSubject('Welcome');
  currentMessage = this.messageSource.asObservable();

  comp1Val: string;
  _comp1ValueBS = new BehaviorSubject<string>('');

  comp2Val: string;
  _comp2ValueBS = new BehaviorSubject<string>('');
  constructor() { 
    this.comp1Val;
    this.comp2Val;

    this._comp1ValueBS.next(this.comp1Val);
    this._comp2ValueBS.next(this.comp2Val);
  }
  updateComp1Val(val) {
    this.comp1Val = val;
    this._comp1ValueBS.next(this.comp1Val);
  }

  updateComp2Val(val) {
    this.comp2Val = val;
    this._comp2ValueBS.next(this.comp2Val);
  }
  changeMessage(message: string) {
    this.messageSource.next(message)
  }
  getLoggedUserName(){
    return this.loggedUser;
  }
  setLoggedUserName(str:any){
    this.loggedUser = str
  }
}
