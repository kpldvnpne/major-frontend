import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LoadedRouterConfig } from '@angular/router/src/config';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  public app: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    let global: any = window;
    this.app = new global.Euphony();
    this.app.initMidi(() => {
      this.app.initScene(this.canvasRef.nativeElement);      
    });

    this.http.get('/tracks/042-Brahms - Rhapsody in G Op-79 No-2', {responseType: 'text'})
      .subscribe((midiFile: any) => {
        this.app.loadMidiFile(midiFile, () => {
          setTimeout(() => {
            this.app.start();
          }, 2000);
        })
      })
    // console.log(global.player);
    // this.app.start();
    // this.app.loadMidiFile(midiFile, function() {
    //   global.player.play();
    // }
  }
}
