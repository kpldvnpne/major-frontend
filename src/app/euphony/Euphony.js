
// The Euphony class provides interfaces to play MIDI files and do 3D visualization.
// The controller and playlist on the left of the screen is not part of it.

import { PianoKeyboardDesign, PianoKeyboard } from './PianoKeyboard.js';

export class Euphony {

  constructor() {
    this.start = this.start.bind(this);
    this.resume = this.resume.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.getEndTime = this.getEndTime.bind(this);
    this.setCurrentTime = this.setCurrentTime.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.design = new PianoKeyboardDesign();
    this.keyboard = new PianoKeyboard(this.design);
    this.rain = new NoteRain(this.design);
    this.particles = new NoteParticles(this.design);

    this.player = MIDI.Player;
    this.player.addListener(data => {
      const NOTE_OFF = 128;
      const NOTE_ON  = 144;
      const {note, message} = data;
      if (message === NOTE_ON) {
        this.keyboard.press(note);
        return this.particles.createParticles(note);
      } else if (message === NOTE_OFF) {
        return this.keyboard.release(note);
      }
    });
    this.player.setAnimation({
      delay: 20,
      callback: data => {
        const {now, end} = data;
        if (typeof this.onprogress === 'function') {
          this.onprogress({
          current: now,
          total: end
        });
        }
        return this.rain.update(now * 1000);
      }
    });
  }

  initScene() {
    this.scene = new Scene('#canvas');
    this.scene.add(this.keyboard.model);
    this.scene.add(this.rain.model);
    this.scene.add(this.particles.model);
    return this.scene.animate(() => {
      this.keyboard.update();
      return this.particles.update();
    });
  }

  initMidi(callback) {
    return MIDI.loadPlugin(function() {
      // mute channel 10, which is reserved for percussion instruments only.
      // the channel index is off by one
      MIDI.channels[9].mute = true;
      return (typeof callback === 'function' ? callback() : undefined);
    });
  }

  loadBuiltinPlaylist(callback) {
    if (this.playlist) { return callback(this.playlist); }
    return $.getJSON('tracks/index.json', playlist => {
      this.playlist = playlist;
      return callback(this.playlist);
    });
  }

  loadBuiltinMidi(id, callback) {
    if (!(0 <= id && id < this.playlist.length)) { return; }

    // try to load the MIDI file from localStorage
    if (typeof localStorage !== 'undefined' && localStorage !== null ? localStorage[id] : undefined) {
      return this.loadMidiFile(localStorage[id], callback);
    }

    // if the file is not available in the localStorage
    // then issue an AJAX request to get it from remote server
    // and try to save the file into localStorage
    return $.ajax({
      url: `tracks/${this.playlist[id]}`,
      dataType: 'text',
      success: data => {
        this.loadMidiFile(data, callback);
        try {
          return (typeof localStorage !== 'undefined' && localStorage !== null ? localStorage[id] = data : undefined);
        } catch (e) {
          return (typeof console !== 'undefined' && console !== null ? console.error('localStorage quota limit reached') : undefined);
        }
      }
    });
  }

  // load a base64 encoded or binary XML MIDI file
  loadMidiFile(midiFile, callback) {
    return this.player.loadFile(midiFile, () => {
      return this.rain.setMidiData(this.player.data, callback);
    });
  }

  start() {
    this.player.start();
    return this.playing = true;
  }

  resume() {
    this.player.currentTime += 1e-6; // bugfix for MIDI.js
    this.player.resume();
    return this.playing = true;
  }

  stop() {
    this.player.stop();
    return this.playing = false;
  }

  pause() {
    this.player.pause();
    return this.playing = false;
  }

  getEndTime() {
    return this.player.endTime;
  }

  setCurrentTime(currentTime) {
    this.player.pause();
    this.player.currentTime = currentTime;
    if (this.playing) { return this.player.resume(); }
  }

  setProgress(progress) {
    const currentTime = this.player.endTime * progress;
    return this.setCurrentTime(currentTime);
  }

  on(eventName, callback) {
    return this[`on${eventName}`] = callback;
  }
}
