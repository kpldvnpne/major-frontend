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

  public opened = true;
  public instruments = {
    "acoustic_grand_piano": 0,
    "acoustic_guitar_nylon": 24,
    "acoustic_guitar_steel": 25,
    "alto_sax": 65,
    "baritone_sax": 67,
    // "bassoon": 70,
    "brass_section": 61,
    // "clarinet": 71,
    "distortion_guitar": 30,
    "electric_bass_finger": 33,
    "electric_bass_pick": 34,
    "electric_guitar_jazz": 26,
    "flute": 73,
    "soprano_sax": 64,
    "synth_drum": 118,
    "tabla": 118,
    "tenor_sax": 66,
    "trumpet": 56,
  };

  public get instrumentsList(): string[] {
    return Object.keys(this.instruments);
  }

  public app: any;
  public models = ['empty'];
  public musicFiles = ['empty'];
  public channelsInstruments: any;
  public channelsInstrumentsList:any;
  
  public parseChannelsInstruments(): any{
    let list:any = [];
    for (let channel in this.channelsInstruments) {
      if (this.channelsInstruments.hasOwnProperty(channel)) {
        list.push({
          channel: channel,
          instrument: this.channelsInstruments[channel],
        });
      }
    }
    return list;
  }

  private MIDI: any = (window as any).MIDI;

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
      this.MIDI.programChange(1, 24);
    });

    
    // console.log(global.player);
    // this.app.start();
    // this.app.loadMidiFile(midiFile, function() {
    //   global.player.play();
    // }
  }

  public midiFileChange(event: any) {
    this.changeMidiFile(event.value);
  }

  public soundFontChange(event: any, channel: number) {
    this.app.stop();
    const prevChannel = channel;
    const nextInstrument = event.value;
    const nextChannel = this.instruments[event.value];

    this.MIDI.loadPlugin({
      soundfontUrl: "./soundfont/",
      instruments: [ nextInstrument ],
      onsuccess: () => {
        this.MIDI.programChange(prevChannel, nextChannel);
        this.app.start();
      }
    })
  }

  private changeMidiFile(filename: string) {
    this.app.loadMidiFile(API_BASE_URL + "api/midi/file/" + filename, () => {
      setTimeout(() => {
        this.app.start();
      }, 1000);
    
      this.channelsInstruments = this.getChannelsInstruments();
      this.channelsInstrumentsList = this.parseChannelsInstruments();
      
      for (let channel in this.channelsInstruments) {
        if (this.channelsInstruments.hasOwnProperty(channel)) {
          let instrument = this.channelsInstruments[channel];
          
          if (this.instruments[instrument] === undefined) {
            instrument = "acoustic_grand_piano";
          }
          this.channelsInstruments[channel] = instrument;
          const respectiveChannel = this.instruments[instrument];
          this.MIDI.programChange(channel, respectiveChannel);
        }
      }
    });

    // this.appService.getMidiFile(filename)
    //   .subscribe((midiFile: any) => {
    //     // console.log(midiFile);
    //     this.app.loadMidiFile(midiFile, () => {
    //       setTimeout(() => {
    //         this.app.start();
    //       }, 2000);
    //     })
    //   });
  }

  private getChannelsInstruments() {
    const midi = this.MIDI.Player;
    const MIDI = this.MIDI;
    let channels = {};
    let programs = {};
    for (let n = 0; n < midi.data.length; n++) {
      let event = midi.data[n][0].event;
      if (event.type !== 'channel') {
        continue;
      }
      let channel = event.channel;
      switch (event.subtype) {
        case 'controller':
          //				console.log(event.channel, MIDI.defineControl[event.controllerType], event.value);
          break;
        case 'programChange':
          programs[channel] = event.programNumber;
          break;
        case 'noteOn':
          let program = programs[channel];
          let gm = MIDI.GM.byId[isFinite(program) ? program : channel];
          channels[channel] = gm.id;
          break;
      }
    }

    return channels;
  }
}
