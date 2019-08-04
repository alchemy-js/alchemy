const fs = require('fs');

const Listen = require('../lib/listener');

describe('Listener', () => {
  let listener;

  beforeEach(() => {
    listener = new Listen();
  });

  describe('Listen.onChange', () => {
    it('should execute a callback when it detects events from fs.watch', () => {
      const callback = jest.fn();
      jest.useFakeTimers();
      fs.watch = (arr, opts, cb) => cb('eventType', 'index.md');
      listener.onChange(['./test/fixture/data'], callback);
      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
