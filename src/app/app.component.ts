import { Component } from '@angular/core';
import { GlobalVariablesService } from './global-variables.service'
import {  } from './login/login.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GlobalVariablesService]
})
export class AppComponent {
  title = 'machineAssignApp';
  message: string;
  constructor(private _gvs: GlobalVariablesService) { }
  async onInit() {
    this._gvs.currentMessage.subscribe(message => this.message = message)
  }
}
