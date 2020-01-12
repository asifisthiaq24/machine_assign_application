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
  username: string;
  role: string;
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [GlobalVariablesService]
})
export class HomePageComponent implements OnInit {
  isAdmin:boolean=false;
  animal: string;
  name: string;
  welcomeMsg: any = '';
  auth_bol: Boolean = false;
  message: string;
  //table
  displayedColumns2: string[] = ['username', 'email', 'role', 'action'];
  dataSource2: UserI[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //table
  //async validation
  @ViewChild('modalRegisterForm') modalRegisterForm: ElementRef;
  @ViewChild('modalRegisterFormEdit') modalRegisterFormEdit: ElementRef;

  //constructor
  constructor(private http: HttpClient, private router: Router, private _gvs: GlobalVariablesService, public dialog: MatDialog, private modalService: NgbModal) { }
  //init
  ngOnInit() {
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
    let resp_get_role = this.http.get('http://localhost:3001/login/getrole/'+localStorage.getItem('uid'))
    resp_get_role.subscribe((data) => {
      console.log(data);
      if(data.role=='admin'){
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
        let resp_get = this.http.get('http://localhost:3001/login/', httpOptions)
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
            let resp_get = this.http.get('http://localhost:3001/login/', httpOptions)
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
    this.router.navigate(['/login']);
  }
  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
  //username
  usernameFormControl = new FormControl('', [
    Validators.required,
    //Validators.pattern('[0-9]*')
    Validators.pattern('^(?=.*[a-z])[a-z0-9]{4,}$')
  ]);
  //password
  hide = true;
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('.{6,}$')
  ]);
  //email
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();
  //select role
  selectedRole: string = 'admin';

  roles: Role[] = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'operator', viewValue: 'Operator' }
  ];
  roleFormControl = new FormControl('', [
    Validators.required
  ]);
  //create admin -- modal submission
  username: string;
  password: string;
  email: string;
  myForm: any;
  alreadyExists: boolean = false;
  onSubmitModalForm() {
    if (this.email != undefined && this.username != undefined && this.password != undefined
      && !this.emailFormControl.hasError('email')
      && !this.usernameFormControl.hasError('pattern')
      && !this.passwordFormControl.hasError('pattern')) {
      let resp_post = this.http.post('http://localhost:3001/login/emailvalidation', { email: this.email })
      resp_post.subscribe((data) => {
        console.log(data);
        this.alreadyExists = data.found;
        if (!this.alreadyExists) {
          let resp_post_submit = this.http.post('http://localhost:3001/login/insert', { username: this.username, password: this.password, email: this.email, role: this.selectedRole })
          resp_post_submit.subscribe((data) => {
            this.username = null;
            this.password = null;
            this.email = null;
            console.log('submission succesful')
            console.log(data)
            this.modalRegisterForm.nativeElement.click();
            
            //reloading page
            this.userAuthorization();
          }, (err) => { console.log(err) })
        }
        //this.modalRegisterForm.nativeElement.click();
        //console.log(this.alreadyExists)
      }, (err) => { console.log(err) })
    }

  }
  changeEV() {
    this.alreadyExists = false;
  }

  //for edit()
  //username
  usernameEFormControl = new FormControl('', [
    Validators.required,
    //Validators.pattern('[0-9]*')
    Validators.pattern('^(?=.*[a-z])[a-z0-9]{4,}$')
  ]);
  //password
  hideE = true;
  showPassField = false;
  passwordEFormControl = new FormControl('', [
    Validators.pattern('.{6,}$')
  ]);
  //email
  emailEFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  //matcher = new MyErrorStateMatcher();
  //select role
  selectedRoleE: string = 'admin';

  rolesE: Role[] = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'operator', viewValue: 'Operator' }
  ];
  roleEFormControl = new FormControl('', [
    Validators.required
  ]);
  //create admin -- modal submission
  usernameE: string;
  passwordE: string;
  emailE: string;
  myFormE: any;
  alreadyExistsE: boolean = false;
  onSubmitModalFormEdit() {
    if (this.passwordE != undefined) {
      if (this.usernameE == this.tempUsername) {
        if (this.emailE != undefined && this.usernameE != undefined
          && !this.emailEFormControl.hasError('email')
          && !this.usernameEFormControl.hasError('pattern')
          && !this.passwordEFormControl.hasError('pattern')) {
          let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updateuser/' + this.tempID, { username: this.usernameE, password: this.passwordE, email: this.emailE, role: this.selectedRoleE, id: this.tempID })
          resp_post_submit_edit.subscribe((data) => {
            this.usernameE = null;
            this.passwordE = null;
            this.emailE = null;
            this.tempUsername = null;
            this.tempID = null;
            this.modalRegisterFormEdit.nativeElement.click();
            //reloading page
            this.userAuthorization();
          })
        }
      }
      else {
        if (this.emailE != undefined && this.usernameE != undefined
          && !this.emailEFormControl.hasError('email')
          && !this.usernameEFormControl.hasError('pattern')
          && !this.passwordEFormControl.hasError('pattern')) {
          let resp_post = this.http.post('http://localhost:3001/login/emailvalidation', { email: this.emailE })
          resp_post.subscribe((data) => {
            console.log(data);
            this.alreadyExists = data.found;
            if (!this.alreadyExistsE) {
              let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updateuser/' + this.tempID, { username: this.usernameE, password: this.passwordE, email: this.emailE, role: this.selectedRoleE })
              resp_post_submit_edit.subscribe((data) => {
                this.usernameE = null;
                this.passwordE = null;
                this.emailE = null;
                this.tempUsername = null;
                this.tempID = null;
                this.modalRegisterFormEdit.nativeElement.click();
                //reloading page
                this.userAuthorization();
              })
            }
          }, (err) => { console.log(err) })
        }
      }
    }
    else{
      if (this.usernameE == this.tempUsername) {
        if (this.emailE != undefined && this.usernameE != undefined
          && !this.emailEFormControl.hasError('email')
          && !this.usernameEFormControl.hasError('pattern')) {
          let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updateuser/' + this.tempID, { username: this.usernameE, password: 'empty', email: this.emailE, role: this.selectedRoleE, id: this.tempID })
          resp_post_submit_edit.subscribe((data) => {
            this.usernameE = null;
            this.passwordE = null;
            this.emailE = null;
            this.tempUsername = null;
            this.tempID = null;
            this.modalRegisterFormEdit.nativeElement.click();
            //reloading page
            this.userAuthorization();
          })
        }
      }
      else {
        if (this.emailE != undefined && this.usernameE != undefined
          && !this.emailEFormControl.hasError('email')
          && !this.usernameEFormControl.hasError('pattern')) {
          let resp_post = this.http.post('http://localhost:3001/login/emailvalidation', { email: this.emailE })
          resp_post.subscribe((data) => {
            console.log(data);
            this.alreadyExists = data.found;
            if (!this.alreadyExistsE) {
              let resp_post_submit_edit = this.http.patch('http://localhost:3001/login/updateuser/' + this.tempID, { username: this.usernameE, password: 'empty', email: this.emailE, role: this.selectedRoleE })
              resp_post_submit_edit.subscribe((data) => {
                this.usernameE = null;
                this.passwordE = null;
                this.emailE = null;
                this.tempUsername = null;
                this.tempID = null;
                this.modalRegisterFormEdit.nativeElement.click();
                //reloading page
                this.userAuthorization();
              })
            }
          }, (err) => { console.log(err) })
        }
      }
    }
  }
  changeEVE() {
    this.alreadyExistsE = false;
  }
  tempUsername: string;
  tempID: string;
  getValueForEdit(_id) {
    let resp_post = this.http.post('http://localhost:3001/login/getuser', { id: _id, role: 'admin' })
    resp_post.subscribe((data) => {
      this.usernameE = data[0].username;
      this.tempUsername = data[0].username;
      this.tempID = _id;
      //this.passwordE = '12345';
      this.emailE = data[0].email;
    }, (err) => { console.log(err) })
  }
  delete_user(_id) {
    let resp_post = this.http.delete('http://localhost:3001/login/deleteuser/'+_id)
    resp_post.subscribe((data) => {
      console.log(data);
      this.userAuthorization();
    }, (err) => { console.log(err) })
  }
}
