/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class LoaderWidget {
  static initClass() {
    this.prototype.opts = {
      color: '#aaaaaa',
      width: 4
    };
  }

  constructor() {
    this.onresize = this.onresize.bind(this);
    this.message = this.message.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.window = $(window);

    this.overlay = $('<div>')
      .width(this.window.width())
      .height(this.window.height())
      .hide()
      .css({
        position: 'absolute',
        top: 0,
        left: 0,
        'z-index': 10000,
        background: 'rgba(0, 0, 0, 0.7)',
        'text-align': 'center'}).appendTo(document.body)
      .on('selectstart', (() => false));

    this.box = $('<div>')
      .width(300)
      .height(200)
      .appendTo(this.overlay);
    
    this.canvas = $('<div>')
      .height(100)
      .appendTo(this.box);

    this.text = $('<div>')
      .css({
        color: '#ddd',
        'font-size': '12px',
        cursor: 'default'}).appendTo(this.box);

    this.onresize();
    this.window.resize(this.onresize);
  }

  onresize() {
    const [width, height] = Array.from([this.window.width(), this.window.height()]);
    this.box
      .css({
        position: 'absolute',
        top: (height - 200) / 2,
        left: (width - 300) / 2
    });
    return this.overlay
      .width(width)
      .height(height);
  }


  message(msg, callback) {
    if (msg != null) { this.text.html(msg); }
    if (this.isActive) {
      return (typeof callback === 'function' ? callback() : undefined);
    } else {
      return this.start(callback);
    }
  }

  start(callback) {
    this.overlay.fadeIn(() => {
      return (typeof callback === 'function' ? callback() : undefined);
    });
    if (this.spin) {
      this.spin.spin(this.canvas[0]);
    } else {
      this.spin = new Spinner(this.opts);
      this.spin.spin(this.canvas[0]);
    }
    return this.isActive = true;
  }
  
  stop(callback) {
    return this.overlay.fadeOut('slow', () => {
      if (this.spin != null) {
        this.spin.stop();
      }
      this.isActive = false;
      return (typeof callback === 'function' ? callback() : undefined);
    });
  }
}
LoaderWidget.initClass();

this.LoaderWidget = LoaderWidget;
