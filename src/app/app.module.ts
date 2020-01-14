import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {UserService} from './user.service';
import { HomePageComponent } from './home-page/home-page.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatTableModule } from '@angular/material'; 
import { GlobalVariablesService } from './global-variables.service';
import {MatDialogModule} from '@angular/material/dialog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { OperatorListComponent } from './operator-list/operator-list.component';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineAssigneToOperatorComponent } from './machine-assigne-to-operator/machine-assigne-to-operator.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { OperatorHomeComponent } from './operator-home/operator-home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    OperatorListComponent,
    MachineListComponent,
    MachineAssigneToOperatorComponent,
    OperatorHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    NgbModule,
    MatCheckboxModule,
    MatDatepickerModule
  ],
  entryComponents: [],
  providers: [UserService,GlobalVariablesService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
