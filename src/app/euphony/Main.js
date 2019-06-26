/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
$(document)
  .on('selectstart', () => false).on('mousewheel', () => false).on('dragover', () => false).on('dragenter', () => false).on('ready', function() {

    // global loader to show progress
    window.loader = new LoaderWidget();
    loader.message('Downloading');

    //start app
    window.app = new Euphony();
    return app.initMidi(function() {
      app.initScene();
      return app.loadBuiltinPlaylist(function(playlist) {
        window.player = new PlayerWidget('#player');
        player.setPlaylist(playlist);
        player.on('pause', app.pause);
        player.on('resume', app.resume);
        player.on('stop', app.stop);
        player.on('play', app.start);
        player.on('progress', app.setProgress);
        player.on('trackchange', trackId =>
          loader.message('Loading MIDI', () =>
            app.loadBuiltinMidi(trackId, () =>
              loader.stop(() => player.play())
            )
          )
        );
        player.on('filedrop', function(midiFile) {
          player.stop();
          return loader.message('Loading MIDI', () =>
            app.loadMidiFile(midiFile, () =>
              loader.stop(() => player.play())
            )
          );
        });
        app.on('progress', player.displayProgress);

        player.show(function() {
          if (window.location.hash) {
            return player.setTrackFromHash();
          } else {
            const candidates = [3, 5, 6, 7, 10, 11, 12, 13, 14, 16, 19, 30];
            const id = Math.floor(Math.random() * candidates.length);
            return player.setTrack(candidates[id]);
          }
        });

        setTimeout((function() {
          player.hide();
          return player.autoHide();
        }), 5000);

        // drag and drop MIDI files to play
        return $(document).on('drop', function(event) {
          if (!event) { ({ event } = window); }
          event.preventDefault();
          event.stopPropagation();

          // jquery wraps the original event
          event = event.originalEvent || event;

          const files = event.files || event.dataTransfer.files;
          const file = files[0];

          const reader = new FileReader();
          reader.onload = function(e) {
            const midiFile = e.target.result;
            player.stop();
            return loader.message('Loading MIDI', () =>
              app.loadMidiFile(midiFile, () =>
                loader.stop(() => player.play())
              )
            );
          };
          return reader.readAsDataURL(file);
        });
      });
    });
});
