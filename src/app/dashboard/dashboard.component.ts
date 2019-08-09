import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { API_BASE_URL, AI_API_URL } from '../constants';
import { AppService } from '../app.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSidenav, MatDialog } from '@angular/material';
import { PlayerStatus } from '../player-status';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { APIService } from '../api.service';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { tap } from 'rxjs/operators';

export const MILLISECONDS_IN_SECOND = 1000;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(AudioPlayerComponent) audioPlayer: AudioPlayerComponent;

  public opened = true;
  public musicLength: number = 0;
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

  /* For ControlPanel */
  public genreList: {id: number, name: string}[];
  public instrumentList: {id: number, name: string}[];
  public keyList: {id: number, name:string}[];
  public octaveTypes = ["lower", "higher"];
  // --
  public genreSelected: number = 0;
  public instrumentSelected: number = 0;
  public keySelected: string = "C";
  public numBars: number = 4;
  public bpm: number = 100;
  public seedLength: number = 4;
  public chordTemperature: number = 1;
  public noteCap: number = 2;
  public whichOctave: number = 1;
  public octaveType: "lower" | "higher" = "lower";
  // state of generation
  public musicIsGenerated = false;
  // download music link
  public DOWNLOAD_MUSIC_URL = Location.joinWithSlash(AI_API_URL, "/api/v1/music_mp3");
  
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

  constructor(
    private appService: AppService, 
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router,
    private apiService: APIService,
    private dialog: MatDialog
  ) {
    this.appService.getMidiFiles()
      .subscribe((midiFiles: string[]) => {
        this.musicFiles = midiFiles;
      });
  }

  ngOnInit() {
    if(!this.authService.isLoggedIn) {
      this.router.navigateByUrl('/login');
    }

    let global: any = window;
    this.app = new global.Euphony();
    this.app.initMidi(() => {
      this.app.initScene(this.canvasRef.nativeElement);
      this.MIDI.programChange(1, 24);
    });

    this.loadControlPanelInfo();
  }

  public loadControlPanelInfo() {
    this.apiService.getAllInformation()
      .subscribe(({ genre, instruments, keys }: any) => {
        this.genreList = genre;
        this.instrumentList = instruments;
        this.keyList = keys;
      });
  }

  public generateMusic() {
    const generateOptions = {
      "genre_id": this.genreSelected,
      "instrument_id": this.instrumentSelected,
      "num_bars": this.numBars,
      "BPM": this.bpm,
      "chord_temperature": this.chordTemperature,
      "seed_length": this.seedLength,

      "note_cap": this.noteCap,

      "key": this.keySelected,
      "octave_type": this.octaveType,
      "which_octave": this.whichOctave,
    };
    this.apiService.generateMusic(generateOptions)
      .pipe(
        tap(() => this.musicIsGenerated = true)
      )
      .subscribe((response: any) => {
        const midiPath = response.link;
        const midiUrl = Location.joinWithSlash(AI_API_URL, Location.joinWithSlash("/static/", midiPath));
        this.changeMidiTrack(midiUrl);
      });
  }

  public viewPdf() {
    const pdfUrl = Location.joinWithSlash(AI_API_URL, "/api/v1/sheet_music/pdf");
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      width: '90%',
      height: '90%',
      data: {pdfUrl: pdfUrl}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    })
  }

  public logoutClick() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  public toggleSideNav() {
    this.sidenav.toggle();
    this.app.resize();
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

  public handlePlayerStatusChange({isPlaying, timePosition}: PlayerStatus) {
    if (isPlaying) {
      if (!this.app.playing) {
        this.app.resume();
      }
    } else {
      if (this.app.playing) {
        this.app.stop();
      }
    }

    this.app.setCurrentTime(timePosition * MILLISECONDS_IN_SECOND);
  }

  private changeMidiFile(filename: string) {
    this.changeMidiTrack(API_BASE_URL + "api/midi/file/" + filename);
  }

  private changeMidiTrack(file: string) {
    this.app.loadMidiFile(file, () => {
      // as there is a play controller, disable auto start
      /* setTimeout(() => {
        this.app.start();
      }, 1000); */
      // reset music player
      this.audioPlayer.stop();

      // update time length
      this.musicLength = this.app.getEndTime() / MILLISECONDS_IN_SECOND;

      this.channelsInstruments = this.getChannelsInstruments();

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

      this.channelsInstrumentsList = this.parseChannelsInstruments();
    });
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
