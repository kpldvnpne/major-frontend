import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { API_BASE_URL } from './constants';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef;

  public app: any;
  public models = ['RNN/LSTM', 'PI'];
  public musicFiles = ['firstmidi', 'secondmidi'];
  public instruments = ['guitar', 'piano'];

  constructor(private http: HttpClient, private appService: AppService) {
    this.appService.getMidiFiles()
      .subscribe((midiFiles: string[]) => {
        this.musicFiles = midiFiles;
      });
  }

  ngOnInit() {
    let global: any = window;
    this.app = new global.Euphony();
    this.app.initMidi(() => {
      this.app.initScene(this.canvasRef.nativeElement);      
    });

    this.appService.getMidiFile('firstMidi')
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
