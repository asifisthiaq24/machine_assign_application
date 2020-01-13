import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GlobalVariablesService } from '../global-variables.service'
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ElementRef } from '@angular/core';

//select
export interface Schedule {
  value: string;
  viewValue: string;
}
export interface MacI {
  _id: string;
  name: string;
}
export interface OperatorI {
  _id: string;
  username: string;
}
//email
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
//user
export interface MaoI {
  _id: string,
  oid: string;
  mid: string;
  username: string;
  schedule: string;
  activatedDate: string;
}
@Component({
  selector: 'app-machine-assigne-to-operator',
  templateUrl: './machine-assigne-to-operator.component.html',
  styleUrls: ['./machine-assigne-to-operator.component.css']
})
export class MachineAssigneToOperatorComponent implements OnInit {
  model;
  isAdmin: boolean = false;
  animal: string;
  name: string;
  welcomeMsg: any = '';
  auth_bol: Boolean = false;
  message: string;
  //table
  displayedColumns2: string[] = ['mid', 'oid', 'username', 'schedule', 'activatedDate'];
  dataSource2: MaoI[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //table
  //async validation
  @ViewChild('modalRegisterForm', { static: false }) modalRegisterForm: ElementRef;
  @ViewChild('modalRegisterFormEdit', { static: false }) modalRegisterFormEdit: ElementRef;

  //constructor
  constructor(private http: HttpClient, private router: Router, private _gvs: GlobalVariablesService, public dialog: MatDialog, private modalService: NgbModal) { }
  //init
  ngOnInit() {
    console.log(this.model)
    this.helloMsg = ' ' + localStorage.getItem('uname')
    this._gvs.currentMessage.subscribe(message => this.message = message)
    this.userAuthorization();
    //let x = this.http.get<UserI[]>("http://localhost:3001/login/").pipe(tap(console.log));
    // let accessToken = localStorage.getItem('accessToken')
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'authorization': 'Asif ' + accessToken
    //   })
    // };
    // let resp_get = this.http.get('http://localhost:3001/login/',httpOptions)
    // resp_get.subscribe((data) => {
    //   console.log(data);
    //   this.dataSource2 = new MatTableDataSource<UserI>(data);
    //   this.dataSource2.paginator = this.paginator;
    //   this.dataSource2.sort = this.sort;
    // }, (err) => { console.log(err) })
  }
  userAuthorization() {
    let resp_get_role = this.http.get('http://localhost:3001/login/getrole/' + localStorage.getItem('uid'))
    resp_get_role.subscribe((data) => {
      console.log(data);
      if (data.role == 'admin') {
        this.isAdmin = true;
      }
    }, (err) => { console.log(err) })
    let accessToken = localStorage.getItem('accessToken')
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Asif ' + accessToken
      })
    };
    let resp_get_act = this.http.get('http://localhost:3001/login/', httpOptions)
    resp_get_act.subscribe((data) => {
      this.auth_bol = true;
      console.log('access token dia login hoise')
      //-----
      if (this.auth_bol) {
        let resp_get = this.http.get('http://localhost:3001/login/mao/', httpOptions)
        resp_get.subscribe((data: any) => {
          console.log('from access token')
          console.log(data);
          this.dataSource2 = new MatTableDataSource<MaoI>(data);
          this.dataSource2.paginator = this.paginator;
          this.dataSource2.sort = this.sort;
        }, (err) => { console.log('from access token error'); console.log(err) })
      }
      //----
    }, (err) => {
      console.log(err.statusText)
      const refreshToken = localStorage.getItem('refreshToken')
      let resp_post_rft = this.http.post('http://localhost:3001/login/token', { token: refreshToken })
      resp_post_rft.subscribe((data) => {
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'authorization': 'Asif ' + accessToken
          })
        };
        let resp_get_act2 = this.http.get('http://localhost:3001/login/', httpOptions)
        resp_get_act2.subscribe((data) => {
          this.auth_bol = true;
          console.log('refresh token dia login hoise')
          //-----
          if (this.auth_bol) {
            let resp_get = this.http.get('http://localhost:3001/login/mao/', httpOptions)
            resp_get.subscribe((data: any) => {
              console.log('from refresh token')
              console.log(data);
              this.dataSource2 = new MatTableDataSource<MaoI>(data);
              this.dataSource2.paginator = this.paginator;
              this.dataSource2.sort = this.sort;
            }, (err) => { console.log('from refresh token error'); console.log(err) })
          }
          //----
        }, (err) => {
          console.log(err.statusText)
          this.router.navigate(['/login']);
        })
      }, (err) => {
        console.log(err.statusText)
      })
    })
  }
  logOut() {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    localStorage.setItem('uid', '');
    localStorage.setItem('uname', '');
    this.router.navigate(['/login']);
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
  //username
  mnameFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();
  //select role
  //create admin -- modal submission
  mname: string;
  myForm: any;
  alreadyExists: boolean = false;
  onSubmitModalForm() {
    console.log(this.model);
    if (this.model != undefined
      && this.selectedSchedule != undefined
      && this.selectedMac != undefined
      && this.selectedOp != undefined) {
      let usern;
      for (let i = 0; i < this.opOption.length; i++) {
        if (this.opOption[i]._id == this.selectedOp) {
          usern = this.opOption[i].username;
          break;
        }
      }
      let resp_post_submit = this.http.post('http://localhost:3001/login/addmao', { mid: this.selectedMac,oid:this.selectedOp,username:usern,schedule:this.selectedSchedule,activatedDate: this.model.year + '-' + this.pad(this.model.month) + '-' + this.pad(this.model.day)})
      resp_post_submit.subscribe((data) => {
        this.mname = null;
        this.modalRegisterForm.nativeElement.click();
        this.selectedSchedule = undefined
        this.macOption = [];
        this.opOption = [];
        this.scheduleOption=[];
        this.model=undefined;
        this.selectedMac = undefined;
        this.selectedOp = undefined;
        //reloading page
        this.userAuthorization();
      }, (err) => { console.log(err) })
    }
  }
  changeEV() {
    this.alreadyExists = false;
  }

  //for edit()
  //username
  mnameEFormControl = new FormControl('', [
    Validators.required
  ]);
  //matcher = new MyErrorStateMatcher();
  //select role
  selectedRoleE: string = 'operator';



  //create admin -- modal submission
  mnameE: string;
  myFormE: any;
  alreadyExistsE: boolean = false;
  onSubmitModalFormEdit() {
    console.log(this.model);
    // if (this.mnameE != undefined && this.mnameE != '') {
    //   let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updatemachine/' + this.tempID, { name: this.mnameE })
    //   resp_post_submit_edit.subscribe((data) => {
    //     this.mnameE = null;
    //     this.tempUsername = null;
    //     this.tempID = null;
    //     this.modalRegisterFormEdit.nativeElement.click();
    //     //reloading page
    //     this.userAuthorization();
    //   })
    // }
  }

  tempUsername: string;
  tempID: string;
  getValueForEdit(_id) {
    console.log(_id)
    this.alreadyExistsE = false;
    let resp_post = this.http.post('http://localhost:3001/login/getmachine', { id: _id })
    resp_post.subscribe((data) => {
      this.mnameE = data[0].name;
      this.tempID = _id;
    }, (err) => { console.log(err) })
  }
  delete_user(_id) {
    let resp_post = this.http.delete('http://localhost:3001/login/deletemachine/' + _id)
    resp_post.subscribe((data) => {
      console.log(data);
      this.userAuthorization();
    }, (err) => { console.log(err) })
  }
  splitDate(x) {
    let sp = x.split('T');
    return sp[0];
  }
  sch = {
    'a': "A shift 6:00AM to 2:00PM",
    'b': "B shift 2:00PM to 10:00PM",
    'c': "C shift 10:00PM to 6:00AM"
  }
  scheduleOption: Schedule[];
  macOption: MacI[];
  opOption: OperatorI[];
  selectedSchedule: string;
  selectedMac: string;
  selectedOp: string;
  scheduleFormControl = new FormControl('', [
    Validators.required
  ]);
  dateFormControl = new FormControl('', [
    Validators.required
  ]);
  macFormControl = new FormControl('', [
    Validators.required
  ]);
  opFormControl = new FormControl('', [
    Validators.required
  ]);
  changeEvent() {
    console.log(this.model)
    if (this.model != undefined) {
      this.selectedSchedule = undefined
      this.macOption = [];
      this.opOption = [];
      this.selectedMac = undefined;
      this.selectedOp = undefined;
      this.scheduleOption = [
        { value: 'a', viewValue: 'A shift 6:00AM to 2:00PM' },
        { value: 'b', viewValue: 'B shift 2:00PM to 10:00PM' },
        { value: 'c', viewValue: 'C shift 10:00PM to 6:00AM' }
      ];
    }
  }
  pad(str) {
    if (str.toString().length > 1) return str;
    else return '0' + str;
  }
  changeSchedule() {
    if (this.selectedSchedule == 'a'
      || this.selectedSchedule == 'b'
      || this.selectedSchedule == 'c') {
      this.macOption = [];
      this.opOption = [];
      this.selectedMac = undefined;
      this.selectedOp = undefined;
      let resp_post_option = this.http.post('http://localhost:3001/login/getmachineoption/', { activatedDate: this.model.year + '-' + this.pad(this.model.month) + '-' + this.pad(this.model.day), schedule: this.selectedSchedule })
      resp_post_option.subscribe((data: any) => {
        console.log(data);
        this.macOption = data.ms;
        this.opOption = data.us;
      }, (err) => { console.log(err) })
    }
  }


}
