const colors = {
  danger: 1,
  success: 2,
  warning: 3,
  info: 4,
  default: 7,
};

class Logger {
  constructor() {
    this.start = 0;
    this.stop = 0;
  }

  startTimer() {
    this.start = Date.now();
  }

  stopTimer() {
    this.stop = Date.now();
  }

  message(text, { elapseTime, status }) {
    let message = `${new Date().toLocaleTimeString()}: ${text}`;
    if (elapseTime) {
      const timeLapse = this.stop - this.start;
      const time = timeLapse >= 1000 ? `${timeLapse / 1000}s` : `${timeLapse}ms`;
      if (this.stop > 0) {
        message += ` - finished in ~${time}`;
      }
    }
    let type = 'log';
    if (status === 'warning') type = 'warn';
    if (status === 'danger') type = 'error';
    console[type](`\x1b[3${colors[status]}m%s\x1b[0m`, type === 'error' ? `${message}\n\n${text.stack}\n` : message);
  }
}

module.exports = Logger;
