/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class PlayerWidget {
  constructor(container) {
    this.autoHide = this.autoHide.bind(this);
    this.updateSize = this.updateSize.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onplay = this.onplay.bind(this);
    this.onpause = this.onpause.bind(this);
    this.onresume = this.onresume.bind(this);
    this.onstop = this.onstop.bind(this);
    this.onprev = this.onprev.bind(this);
    this.onnext = this.onnext.bind(this);
    this.ontrackchange = this.ontrackchange.bind(this);
    this.setTrack = this.setTrack.bind(this);
    this.setTrackFromHash = this.setTrackFromHash.bind(this);
    this.getRandomTrack = this.getRandomTrack.bind(this);
    this.displayProgress = this.displayProgress.bind(this);
    this.$container = $(container);

    this.$controlsContainer  = $('.player-controls', this.$container);
    this.$playlistContainer  = $('.player-playlist-container', this.$container);
    this.$progressContainer  = $('.player-progress-container', this.$container);

    this.$progressBar        = $('.player-progress-bar', this.$container);
    this.$progressText       = $('.player-progress-text', this.$container);
    this.$playlist           = $('.player-playlist', this.$container);

    this.$prevBtn  = $('.player-prev', this.$container);
    this.$nextBtn  = $('.player-next', this.$container);
    this.$playBtn  = $('.player-play', this.$container);
    this.$stopBtn  = $('.player-stop', this.$container);
    this.$pauseBtn = $('.player-pause', this.$container);

    this.$prevBtn.click(() => this.onprev());
    this.$nextBtn.click(() => this.onnext());
    this.$stopBtn.click(() => this.stop());
    this.$pauseBtn.click(() => this.pause());
    this.$playBtn.click(() => {
      if (this.current === 'paused') { return this.resume(); } else { return this.play(); }
    });

    // invoke callback on progress bar click
    this.$progressContainer.click(event => {
      const progress = (event.clientX - this.$progressContainer.offset().left) / this.$progressContainer.width();
      return (typeof this.progressCallback === 'function' ? this.progressCallback(progress) : undefined);
    });

    // set track on playlist click
    this.$playlist.click(event => {
      const $target = $(event.target);
      if ($target.is('li')) {
        const $list = $('li', this.$playlist);
        return this.setTrack($list.index($target));
      }
    });

    this.$container.on('mousewheel', event => event.stopPropagation());

    // update size
    this.updateSize();
    $(window).resize(this.updateSize);

    // set track on url hash change
    $(window).on('hashchange', this.setTrackFromHash);
  }

  autoHide() {
    const onmousemove = event => {
      if (event.pageX < 400) {
        return this.show();
      } else {
        return this.hide();
      }
    };
    return $(document)
      .on('mousemove', onmousemove)
      .on('mousedown', function() {
        return $(this).off('mousemove', onmousemove);
    }).on('mouseup', function() {
        return $(this).on('mousemove', onmousemove);
    });
  }

  updateSize() {
    return this.$playlistContainer
      .height(
        this.$container.innerHeight() -
        this.$controlsContainer.outerHeight(true) -
        this.$progressContainer.outerHeight(true) -
        15
      )
      .nanoScroller();
  }

  show(callback) {
    if (this.visible || this.animating) { return; }
    this.visible = true;
    this.animating = true;
    return this.$container
      .animate({
        left: '0px'
      }, {
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
          this.animating = false;
          return (typeof callback === 'function' ? callback() : undefined);
        }
      });
  }

  hide(callback) {
    if (!this.visible || this.animating) { return; }
    this.visible = false;
    this.animating = true;
    return this.$container
      .animate({
        left: `${-this.$container.width()}px`
      }, {
        duration: 500,
        easing: 'easeInOutCubic',
        complete: () => {
          this.animating = false;
          return (typeof callback === 'function' ? callback() : undefined);
        }
      });
  }

  setPlaylist(playlist) {
    this.playlist = playlist;
    this.$playlist.html('');
    for (let trackName of Array.from(playlist)) {
      this.$playlist.append($('<li>').text(trackName));
    }
    return this.$playlistContainer.nanoScroller();
  }

  on(eventName, callback) {
    return this[`${eventName}Callback`] = callback;
  }

  onplay() {
    this.$playBtn.hide();
    this.$pauseBtn.show();
    return (typeof this.playCallback === 'function' ? this.playCallback() : undefined);
  }

  onpause() {
    this.$pauseBtn.hide();
    this.$playBtn.show();
    return (typeof this.pauseCallback === 'function' ? this.pauseCallback() : undefined);
  }

  onresume() {
    this.$playBtn.hide();
    this.$pauseBtn.show();
    return (typeof this.resumeCallback === 'function' ? this.resumeCallback() : undefined);
  }

  onstop() {
    this.$pauseBtn.hide();
    this.$playBtn.show();
    return (typeof this.stopCallback === 'function' ? this.stopCallback() : undefined);
  }

  onprev() {
    if (!(this.currentTrackId > 0)) { return; }
    this.currentTrackId -= 1;
    return this.setTrack(this.currentTrackId);
  }

  onnext() {
    if (!(this.currentTrackId < (this.playlist.length - 1))) { return; }
    this.currentTrackId += 1;
    return this.setTrack(this.currentTrackId);
  }

  ontrackchange(trackId) {
    if (!(0 <= trackId && trackId < this.playlist.length)) { return; }
    this.stop();
    if (this.$currentTrack != null) {
      this.$currentTrack.removeClass('player-current-track');
    }
    this.$currentTrack = this.$playlist
      .find("li")
      .eq(trackId)
      .addClass('player-current-track');
    if (typeof this.trackchangeCallback === 'function') {
      this.trackchangeCallback(trackId);
    }
    return this.currentTrackId = trackId;
  }

  setTrack(trackId) {
    return window.location.hash = trackId + 1;
  }

  setTrackFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash) { return this.ontrackchange(parseInt(hash, 10) - 1); }
  }

  getRandomTrack() {
    return this.playlist[Math.floor(Math.random() * this.playlist.length)];
  }

  displayProgress(event) {
    let {current, total} = event;
    current = Math.min(current, total);
    const progress = current / total;
    this.$progressBar.width(this.$progressContainer.width() * progress);
    const curTime = this._formatTime(current);
    const totTime = this._formatTime(total);
    return this.$progressText.text(`${curTime} / ${totTime}`);
  }

  _formatTime(time) {
    const minutes = (time / 60) >> 0;
    let seconds = String((time - (minutes * 60)) >> 0);
    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }
}

StateMachine.create({
  target: PlayerWidget.prototype,
  events: [
    { name: 'init'  , from: 'none'    , to: 'ready'   },
    { name: 'play'  , from: 'ready'   , to: 'playing' },
    { name: 'pause' , from: 'playing' , to: 'paused'  },
    { name: 'resume', from: 'paused'  , to: 'playing' },
    { name: 'stop'  , from: '*'       , to: 'ready'   }
  ]});

this.PlayerWidget = PlayerWidget;
