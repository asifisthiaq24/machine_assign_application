import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {User} from './user'

@Injectable()
export class UserService {
    userUrl='http://localhost:3001/users';
    constructor(private http:HttpClient){}
    getUsersFromServer():Observable<User[]>{
        return this.http.get<User[]>(this.userUrl);
    }
}
