import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public app: any;

  constructor() {
    let global: any = window;
    this.app = new global.Euphony();
    this.app.initScene();

    // this.app = new Euphony();
    // this.app.initScene();
  }
}
