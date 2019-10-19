const assert = require('assert');
const fs = require('fs');
const path = require('path');

const matter = require('gray-matter');

const Listener = require('./listener');
const Logger = require('./logger');

class Generator {
  constructor(options) {
    assert(options.src, '"src" directory path required.');
    assert(options.dest, '"dest" directory path required.');
    this.transmuters = [];
    this.filesystemQueue = [];
    this.logger = new Logger();
    this.listener = new Listener();
    this.src = path.resolve(path.normalize(options.src));
    this.dest = path.resolve(path.normalize(options.dest));
  }

  dequeueNode() {
    return this.filesystemQueue.shift();
  }

  enqueueNode(node) {
    if (node) this.filesystemQueue.push(node);
  }

  watch(paths) {
    this.listener.onChange(paths, () => this.clean().build());
  }

  createDestPath(srcPath, transmutedData = {}) {
    const parsedPath = path.parse(srcPath);
    const { dir, ext, name } = parsedPath;
    const parent = dir.split(this.src);
    return path.format({
      ext: transmutedData.ext || ext,
      name: transmutedData.name || name,
      dir: path.join(parent[0], this.dest, parent[1]),
    });
  }

  transmute(transmuter) {
    this.transmuters.push(transmuter);
    return this;
  }

  processDirectory(directoryPath) {
    // TODO will transmuters want to operate on directories?
    return fs.mkdirSync(this.createDestPath(directoryPath), { recursive: true });
  }

  processFile(filePath) {
    let transmuterFunc;
    let transmutedData = {};

    const transmuters = [...this.transmuters];
    const { dir, ext, name } = path.parse(filePath);

    const fileBuffer = fs.readFileSync(filePath);

    const jpg = b => b.slice(0, 3).equals(Buffer.from([255, 216, 255]));
    const png = b => b.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

    const copy = data => fs.copyFileSync(data, this.createDestPath(data));
    const write = data => fs.writeFileSync(this.createDestPath(filePath, data), data.content);

    const done = (transmutation) => {
      transmutedData = { ...transmutedData, ...transmutation };
      transmuterFunc = transmuters.shift();
    };

    const image = jpg(fileBuffer) || png(fileBuffer);

    transmutedData.content = fileBuffer;
    transmutedData.data = null;
    transmutedData.dest = this.dest;
    transmutedData.dir = dir;
    transmutedData.ext = ext;
    transmutedData.ignore = false;
    transmutedData.name = name;
    transmutedData.src = this.src;

    if (!image) {
      const { content, data } = matter(fileBuffer);
      transmutedData.content = content;
      transmutedData.data = data;
    }

    transmuterFunc = transmuters.shift();

    while (transmuterFunc) {
      transmuterFunc(transmutedData, done);
    }

    if (transmutedData.ignore) {
      return false;
    }

    return this.transmuters.length > 0 ? write(transmutedData) : copy(filePath);
  }

  traverse(directoryHandler, fileHandler, node) {
    let current;

    const contents = fs.readdirSync(node, { withFileTypes: true });
    contents.forEach(content => this.enqueueNode({
      cwd: node,
      parent: null,
      node: content,
    }));

    current = this.dequeueNode();

    while (current) {
      const nodePath = path.resolve(current.cwd, current.node.name);
      if (current.node.isDirectory()) {
        directoryHandler(current, nodePath);
      }
      if (current.node.isFile()) {
        fileHandler(current, nodePath);
      }
      current = this.dequeueNode();
    }
  }

  build() {
    this.logger.startTimer();

    const node = this.src;
    const directoryHandler = (current, nodePath) => {
      const contents = fs.readdirSync(nodePath, { withFileTypes: true });
      contents.forEach(content => this.enqueueNode({
        cwd: nodePath,
        parent: current,
        node: content,
      }));

      this.processDirectory(nodePath);
    };
    const fileHandler = (current, nodePath) => this.processFile(nodePath);

    try {
      this.traverse(directoryHandler, fileHandler, node);
      this.logger.stopTimer();
      this.logger.message('Site built!', {
        status: 'success',
        elapseTime: true,
      });
      return this;
    } catch (error) {
      this.logger.stopTimer();
      return this.logger.message(error, {
        status: 'danger',
        elapseTime: true,
      });
    }
  }

  clean() {
    this.logger.startTimer();

    const node = this.dest;
    const directoryHandler = (current, nodePath) => {
      // FIXME is there a better way to handle this?
      // handle instances where item is in queue more than once
      // e.g., a directory with several files
      const exists = fs.existsSync(nodePath);
      if (exists) {
        const contents = fs.readdirSync(nodePath, { withFileTypes: true });
        if (contents.length > 0) {
          contents.forEach(content => this.enqueueNode({
            cwd: nodePath,
            parent: current,
            node: content,
          }));
        } else {
          this.enqueueNode(current.parent);
          fs.rmdirSync(nodePath);
        }
      }
    };

    const fileHandler = (current, nodePath) => {
      this.enqueueNode(current.parent);
      fs.unlinkSync(nodePath);
    };

    try {
      // create the destination if it doesn't exist
      const exists = fs.existsSync(node);

      if (!exists) {
        fs.mkdirSync(node);
      }

      this.traverse(directoryHandler, fileHandler, node);
      this.logger.stopTimer();
      this.logger.message('Destination cleaned!', {
        status: 'success',
        elapseTime: true,
      });
      return this;
    } catch (error) {
      this.logger.stopTimer();
      return this.logger.message(error, {
        status: 'danger',
        elapseTime: true,
      });
    }
  }
}

module.exports = Generator;
