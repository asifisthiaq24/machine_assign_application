import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { OperatorListComponent } from './operator-list/operator-list.component';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineAssigneToOperatorComponent } from './machine-assigne-to-operator/machine-assigne-to-operator.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'operatorlist', component: OperatorListComponent },
  { path: 'machinelist', component: MachineListComponent },
  { path: 'mao', component: MachineAssigneToOperatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
