import { Component, Input, SimpleChanges } from '@angular/core';
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
export interface Role {
  value: string;
  viewValue: string;
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
export interface UserI {
  _id: string,
  name: string;
  assigned: string;
}

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.css']
})
export class MachineListComponent implements OnInit {

  isAdmin: boolean = false;
  animal: string;
  name: string;
  welcomeMsg: any = '';
  auth_bol: Boolean = false;
  message: string;
  //table
  displayedColumns2: string[] = ['name', 'assigned', 'action'];
  dataSource2: UserI[];
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
        let resp_get = this.http.get('http://localhost:3001/login/machine/', httpOptions)
        resp_get.subscribe((data) => {
          console.log('from access token')
          console.log(data);
          this.dataSource2 = new MatTableDataSource<UserI>(data);
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
            let resp_get = this.http.get('http://localhost:3001/login/machine/', httpOptions)
            resp_get.subscribe((data) => {
              console.log('from refresh token')
              console.log(data);
              this.dataSource2 = new MatTableDataSource<UserI>(data);
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
    if (this.mname != undefined) {
      let resp_post_submit = this.http.post('http://localhost:3001/login/addmachine', { name: this.mname })
      resp_post_submit.subscribe((data) => {
        this.mname = null;
        this.modalRegisterForm.nativeElement.click();
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

  rolesE: Role[] = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'operator', viewValue: 'Operator' }
  ];

  //create admin -- modal submission
  mnameE: string;
  myFormE: any;
  alreadyExistsE: boolean = false;
  onSubmitModalFormEdit() {
    if (this.mnameE != undefined && this.mnameE != '') {
      let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updatemachine/' + this.tempID, { name: this.mnameE })
      resp_post_submit_edit.subscribe((data) => {
        this.mnameE = null;
        this.tempUsername = null;
        this.tempID = null;
        this.modalRegisterFormEdit.nativeElement.click();
        //reloading page
        this.userAuthorization();
      })
    }
  }
  changeEVE() {
    this.alreadyExistsE = false;
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

}
