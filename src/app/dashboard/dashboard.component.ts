import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { API_BASE_URL } from '../constants';
import { AppService } from '../app.service';

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

  constructor(private appService: AppService, private http: HttpClient) {
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
      });
  }
}
