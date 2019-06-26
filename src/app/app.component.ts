import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  public app: any;

  constructor() {
    

    // this.app = new Euphony();
    // this.app.initScene();
  }

  ngOnInit() {
    let global: any = window;
    this.app = new global.Euphony();
    this.app.initScene(this.canvasRef.nativeElement);
  }
}
