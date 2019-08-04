const fs = require('fs');
const path = require('path');

const Logger = require('./logger');

class Listen {
  constructor() {
    this.logger = new Logger();
  }

  onChange(srcArr, callback) {
    this.logger.message('Listening for changes...', {
      status: 'info',
      timestamp: true,
    });

    const debounce = (delay, fn) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn(...args);
          timer = null;
        }, delay);
      };
    };

    const emitter = (src, filename) => {
      const fileChanged = path.join(src, filename);
      const messageText = `Changed: ${fileChanged}`;
      const messageOptions = { status: 'info', timestamp: true };
      this.logger.message(messageText, messageOptions);
      callback(fileChanged);
    };

    const change = debounce(100, emitter);
    const listener = (src, eventType, filename) => change(src, filename);

    srcArr.forEach((src) => {
      fs.watch(src, { recursive: true }, listener.bind(this, src));
    });
  }
}

module.exports = Listen;
