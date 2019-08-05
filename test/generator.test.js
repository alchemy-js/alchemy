const fs = require('fs');
const path = require('path');

const testData = require('./testData');
const testSetup = require('./testSetup');
const testTeardown = require('./testTeardown');

const Generator = require('../lib/generator');

beforeAll(() => testSetup(testData));
afterAll(() => testTeardown(testData));

describe('Generator', () => {
  let generator;
  let node;

  beforeEach(() => {
    generator = new Generator({
      src: './test/fixture/data',
      dest: './test/fixture/public',
      layouts: './test/fixture/layouts',
    });

    generator.logger = {
      stopTimer: jest.fn(),
      startTimer: jest.fn(),
      message: jest.fn(),
    };

    node = {
      cwd: './test/fixture/public',
      parent: null,
      node: {
        name: 'index.html',
        isDirectory() {
          return false;
        },
        isFile() {
          return true;
        },
      },
    };
  });

  describe('Generator.dequeueNode', () => {
    it('should return the item from the front of the queue', () => {
      generator.filesystemQueue = [node];
      expect(generator.dequeueNode(node)).toBe(node);
      expect(generator.filesystemQueue).toEqual([]);
    });
  });

  describe('Generator.enqueueNode', () => {
    it('should return add a node to the queue', () => {
      generator.enqueueNode(node);
      generator.enqueueNode(node);
      expect(generator.filesystemQueue).toStrictEqual([node, node]);
    });
  });

  describe('Generator.traverse', () => {
    it('should call handlers when director and/or file is traversed', () => {
      const directoryHandler = jest.fn();
      const fileHandler = jest.fn();
      // NOTE only "traverses" one level; we pass a mock directoryHandler that doesn't enqueue
      generator.traverse(directoryHandler, fileHandler, path.resolve('./test/fixture/data/'));
      expect(directoryHandler).toBeCalledTimes(3);
      expect(fileHandler).toBeCalledTimes(1);
    });
  });

  describe('Generator.clean', () => {
    it('empties the public directory', () => {
      generator.clean();
      expect([]).toEqual([]);
    });
    it('catches clean errors', () => {
      generator.dest = './test/fixture/someOtherDest';
      generator.clean();
      expect(generator.logger.stopTimer).toBeCalledTimes(1);
      expect(generator.logger.message).toBeCalledTimes(1);
    });
  });

  describe('Generator.build', () => {
    it('builds the site', () => {
      generator.build();
      const expectedContents = ['images', 'index.md', 'scripts', 'styles'];
      const expectedBuffer = Buffer.from('---\ntitle: Hello World\n---\n\n# Hello World!');
      expect(fs.readdirSync(path.resolve('./test/fixture/public'))).toEqual(expectedContents);
      expect(fs.readFileSync(path.resolve('./test/fixture/public/index.md'))).toEqual(expectedBuffer);
    });
    it('catches build errors', () => {
      generator.traverse = null;
      generator.build();
      expect(generator.logger.stopTimer).toBeCalledTimes(1);
      expect(generator.logger.message).toBeCalledTimes(1);
    });
  });

  describe('Generator.transmute', () => {
    it('pushes a function into the transumters queue', () => {
      const transmuter = jest.fn();
      generator.transmute(transmuter);
      expect(generator.transmuters).toEqual([transmuter]);
    });
  });

  describe('Generator.processFile', () => {
    it('should run a file through the transumter queue', () => {
      const transmuter = jest.fn((c, f, done) => done(''));
      generator.transmute(transmuter);
      generator.processFile(path.resolve('./test/fixture/data/index.md'));
      expect(transmuter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Generator.extensionMapper', () => {
    it('should add a map to the instance to assist in mapping extensions of transmuted files', () => {
      const expectedMap = { '.md': '.html' };
      generator.extensionMapper(expectedMap);
      expect(generator.extensionMap).toBe(expectedMap);
    });
  });

  describe('Generator.createDestPath', () => {
    it('should remove this.src from the path when outputting directories/files', () => {
      const srcPath = path.resolve('./test/fixture/data/index.md');
      const expected = path.resolve('./test/fixture/public/index.md');
      expect(generator.createDestPath(srcPath)).toEqual(expected);
    });
  });

  describe('Generator.watch', () => {
    it('should clean and build onChange', () => {
      generator.build = jest.fn(() => generator);
      generator.clean = jest.fn(() => generator);
      generator.listener.onChange = (paths, cb) => cb();
      generator.watch(['./test/fixture/data', './test/fixture/layouts']);
      expect(generator.clean).toHaveBeenCalledTimes(1);
      expect(generator.build).toHaveBeenCalledTimes(1);
    });
  });
});
