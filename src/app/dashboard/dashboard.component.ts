import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { API_BASE_URL } from '../constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('canvas') canvasRef: ElementRef;

  opened = true;
  public app: any;
  public models = ['RNN/LSTM', 'PI'];
  public musicFiles = ['firstmidi', 'secondmidi'];
  public instruments = ['guitar', 'piano'];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    let global: any = window;
    this.app = new global.Euphony();
    this.app.initMidi(() => {
      this.app.initScene(this.canvasRef.nativeElement);      
    });

    const path = Location.joinWithSlash(API_BASE_URL, '/tracks/042-Brahms - Rhapsody in G Op-79 No-2');
    this.http.get(path, {responseType: 'text'})
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
