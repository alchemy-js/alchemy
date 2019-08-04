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
    let formattedMessage = `${new Date().toLocaleTimeString()}: ${text}`;
    if (elapseTime) {
      const timeLapse = this.stop - this.start;
      const formattedTime = timeLapse >= 1000 ? `${timeLapse / 1000}s` : `${timeLapse}ms`;
      if (this.stop > 0) {
        formattedMessage += ` - finished in ~${formattedTime}`;
      }
    }
    let type = 'log';
    if (status === 'warning') type = 'warn';
    if (status === 'danger') type = 'error';
    console[type](`\x1b[3${colors[status]}m%s\x1b[0m`, formattedMessage);
  }
}

module.exports = Logger;
