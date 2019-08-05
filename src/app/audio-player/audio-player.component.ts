import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  @Input() totalTime: number = 0;
  @Input() skipInterval: number = 10;
  public timePosition: number = 0;
  public isPlaying: boolean = false;

  private timer: NodeJS.Timer;
    
  constructor() { 
  }

  ngOnInit() {
  }

  public startPlaying(): void {
    this.resume();
  }

  public pause(): void {
    this.isPlaying = false;
    clearInterval(this.timer);
  }

  public resume(): void {
    this.isPlaying = true;
    this.timer = setInterval(() => {
      if (this.timePosition < this.totalTime) {
        this.timePosition += 1;
      } else {
        this.stop();
      }
    }, 1000);
  }

  public stop(): void {
    this.pause();
    this.timePosition = 0;
  }

  public fastForward(): void {
    this.timePosition += this.skipInterval;
  }

  public fastRewind(): void {
    this.timePosition -= this.skipInterval;
  }

  public playPauseClick() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public convertIntoTimeFormat(timeInSeconds: number) {
    const SECONDS_IN_MINUTE = 60;
    const MINUTES_IN_HOUR = 60;
    const HOURS_IN_DAY = 24;
    const DAYS_IN_YEAR = 365;

    const convertFactory = moment().startOf('day').seconds(timeInSeconds);
    if (this.totalTime < SECONDS_IN_MINUTE * MINUTES_IN_HOUR) {
      return convertFactory.format('mm:ss');
    } else if (this.totalTime < SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY) {
      return convertFactory.format('H:mm:ss');
    } else if (this.totalTime < SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR) {
      return convertFactory.format('DDD HH:mm:ss');
    } else {
      return convertFactory.format('YYYY DDD HH:mm:ss');
    }
  }

}
