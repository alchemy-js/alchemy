const Logger = require('../lib/logger');

describe('Logger', () => {
  let logger;
  let now;

  const dangerColor = '\x1b[31m%s\x1b[0m';
  const successColor = '\x1b[32m%s\x1b[0m';
  const warningColor = '\x1b[33m%s\x1b[0m';

  beforeEach(() => {
    jest.spyOn(console, 'error');
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'warn');
    logger = new Logger();
    now = new Date().toLocaleTimeString();
    Date.toLocaleTimeString = now;
  });

  afterEach(() => jest.resetAllMocks());

  describe('Logger.startTimer', () => {
    it('should set a start time', () => {
      logger.startTimer();
      expect(logger.start > 0).toBe(true);
    });
  });

  describe('Logger.stopTimer', () => {
    it('should set a stop time', () => {
      logger.stopTimer();
      expect(logger.stop > 0).toBe(true);
    });
  });

  describe('Logger.message', () => {
    it('should format a message without an elapse time', () => {
      logger.message('test', { status: 'success' });
      logger.message('test', { status: 'warning' });
      logger.message('test', { status: 'danger' });
      expect(console.log).toHaveBeenNthCalledWith(1, successColor, `${now}: test`);
      expect(console.warn).toHaveBeenNthCalledWith(1, warningColor, `${now}: test`);
      expect(console.error).toHaveBeenNthCalledWith(1, dangerColor, `${now}: test`);
    });

    it('should format a message with an elapse time in miliseconds', () => {
      logger.start = 0;
      logger.stop = 100;
      logger.message('test', { elapseTime: true, status: 'success' });
      expect(console.log).toHaveBeenNthCalledWith(1, successColor, `${now}: test - finished in ~100ms`);
    });

    it('should format a message with an elapse time in seconds', () => {
      logger.start = 0;
      logger.stop = 2000;
      logger.message('test', { elapseTime: true, status: 'success' });
      expect(console.log).toHaveBeenNthCalledWith(1, successColor, `${now}: test - finished in ~2s`);
    });

    it('should format a message with an elapse time without "finished in" appended to message', () => {
      logger.start = 0;
      logger.stop = 0;
      logger.message('test', { elapseTime: true, status: 'success' });
      expect(console.log).toHaveBeenNthCalledWith(1, '\x1b[32m%s\x1b[0m', `${now}: test`);
    });
  });
});
