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

  constructor(){

<<<<<<< HEAD
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

    
    // console.log(global.player);
    // this.app.start();
    // this.app.loadMidiFile(midiFile, function() {
    //   global.player.play();
    // }
  }

  midiFileChange(event: any) {
    this.changeMidiFile(event.value);
  }

  private changeMidiFile(filename: string) {
    this.appService.getMidiFile(filename)
      .subscribe((midiFile: any) => {
        console.log(midiFile);
        this.app.loadMidiFile(midiFile, () => {
          setTimeout(() => {
            this.app.start();
          }, 2000);
        })
      })
=======
  }

  ngOnInit() {
    
>>>>>>> 38290021e5bb7bda1f916306f79fe3e7c6cdd20e
  }
}
